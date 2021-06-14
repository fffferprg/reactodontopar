import React, { Component } from 'react';
import { Row, Col, Form, Button, Table , Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; 
import { ToastContainer, toast } from 'react-toastify';
import Informe from '../../componentes/Informe';
import {MODULES_BECAME_STANDARD_YEAR, imprimirAviso } from './productos';  
import { MdDeleteForever, MdCreate, MdFindInPage} from "react-icons/md";
import NumberFormat from 'react-number-format';
import PopupProductos from './PopupProductos';





                    //  *************************STATES*********************

class ProductoVenta extends Component {
    state={
        fecha:'',
        productoNombre:'',
        codigo:'0',
        precioVenta:'',
        precioCompra:'0',
        cantidad:0,
        tipoMovimiento: 2,
        estado: 1,            // estado 1 = activo / 0 = anulado
        listaMovimientos: [],
        listaProductos: [],
        metodoDesuscribirse:null,
        productoEditarId: null,
        mostrarFiltro: true,// variable para mostrar y ocultar filtros 
        filtroCodigo:'',
        filtroProductoNombre:'',
        titulo:'',
        totalPrecioVenta:0,
        totalPrecioCompra:0,
        showModal: false,
        productoSeleccionado:{}
    }

    openModal=()=>{
        this.setState({
          showModal: true
        })
        }

    closeModal=()=>{
          this.setState({
            showModal: false
          }) 
        }


    filtrar = () =>{
         this.setState({mostrarFiltro:!this.state.mostrarFiltro})
    }

    limpiarCampos = () => {
        this.setState({
            fecha:'',
            productoNombre:'',
            codigo:0,
            precioVenta:'',
            cantidad:0,
            tipoMovimiento: 2,
            estado: 1,
            metodoDesuscribirse:null,
            productoEditarId: null,
            filtroCodigo:'',
            filtroProductoNombre:''

        })
    
    }
    confirmarAccion = (movimientoId, productoId, cantidad) => {
        console.log(movimientoId)
        confirmAlert({
          title: 'Accion anular',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.anularMovimiento(movimientoId, productoId, cantidad)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      };

    anularMovimiento =(movimientoId, productoId, cantidad) => {
        console.log(movimientoId)
        console.log(productoId)
        let datosNuevos = {
            estado : 0
        }
        db.collection('movimientos').doc(movimientoId).update(datosNuevos)
        .then(()=>{
            this.sumarSaldoStock(productoId, cantidad)
        })
        .catch((error)=>{
            alert(error)
        })
    }
  
    sumarSaldoStock =(productoId, cantidad)=>{
        let saldoActualProducto = this.obtenerSaldoProducto(productoId)
        console.log(saldoActualProducto)
        let saldoFinal = saldoActualProducto + parseInt(cantidad)
        db.collection('productos').doc(productoId).update({saldo : saldoFinal})
            .catch((error)=>{
                alert(error)
            })
        console.log(saldoFinal)
    }

                    // LUEGO DE MONTAR EL COMPONENTE *******************************
    componentDidMount(){ 
        imprimirAviso()
        this.obtenerMovimientos()
        this.obtenerProductos()
        console.log(MODULES_BECAME_STANDARD_YEAR)
        console.log(this.state.listaMovimientos)
    }

    obtenerSaldoProducto = (productoId) =>{
        let productoTemporal = this.state.listaProductos.filter(producto =>{
            return producto.id == productoId
            
        })
        let saldo = productoTemporal[0].saldo
        return saldo
    }

    obtenerProductos =()=>{
        let listaProductosTemporal = []
        db.collection('productos').get()
        .then((productos)=>{productos.forEach((producto)=>{listaProductosTemporal.push({
                    id : producto.id,
                    ...producto.data()      
                    // producto : producto.producto  // ES LO MISMO QUE LA LINEA ANTERIOR
                })
            })
            this.setState({
                listaProductos : listaProductosTemporal
            })
            // console.log(this.state.listaProductos)
        })
        .catch((error)=>{
            alert(error)
        })
    }


                    // RENDERIZA LISTA DE MOVIMMIENTOS *****************************
    renderListaMovimientos = () => {
        return this.state.listaMovimientos
        .filter((documento)=>{
            return (documento.codigo.toString().indexOf(this.state.filtroCodigo)>=0) 
            && (documento.productoNombre.toLowerCase().indexOf(this.state.filtroProductoNombre.toLowerCase())>=0)
        }) 
        .map((documento) => {
   
            return (
                // key es un identificador unico
                <tr key={documento.id}> 
                    <td style={{textAlign:"center"}}>{documento.codigo}</td>
                    <td>{documento.productoNombre}</td>
                    <td style={{textAlign:"right"}}> <NumberFormat value={documento.precioCompra} displayType={'text'} thousandSeparator={true} /></td>
                    <td style={{textAlign:"right"}}><NumberFormat value={documento.precioVenta} displayType={'text'} thousandSeparator={true} /></td>
                    <td style={{textAlign:"center"}}>{documento.cantidad}</td>
                    <td style={{textAlign:"center"}}>{moment(documento.fecha).format('DD/MM/YYYY')}</td>
                    {/* <td>{documento.estado==1?<Badge pill variant="info"> Activo </Badge>:<Badge pill variant="danger"> Anulado </Badge>}</td> */}
                    <td style={{textAlign:"center"}}>{documento.estado!=1?<Badge pill variant="danger"> X </Badge>:null}</td>
                    {/* <td> <a href = '#' onClick ={()=>this.cargarForm(documento.id)}> Editar </a> {documento.estado==0?null:<a href = '#' onClick ={()=>this.confirmarAccion(documento.id)}>| Anular </a>} </td> */}
                    <td style={{textAlign:"center"}}> {documento.estado != 0? <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id, documento.productoId, documento.cantidad)} />:null}</td>
                </tr>
            )
        })
    }

renderItems =() => {
    return this.state.listaProductos.map((producto)=>{
        return (
        <option key={producto.id} value = {producto.id}>{producto.productoNombre}</option>
        )
    }) 
}
obtenerDatosProducto = (productoId) =>{
    let productoTemporal = this.state.listaProductos.filter(producto =>{
        return producto.id == productoId
    })
    return productoTemporal[0]
}

obtenerCodigoProducto = (productoId) =>{
    let productoTemporal = this.state.listaProductos.filter(producto =>{
        return producto.id == productoId
    })
    let codigoProducto = productoTemporal[0].codigo
    return codigoProducto
}
obtenerPrecioProducto = (productoId) =>{
    let productoTemporal = this.state.listaProductos.filter(producto =>{
        return producto.id == productoId
    })
    let precioProducto = productoTemporal[0].precioVenta
    return precioProducto
}

                        //********************************************CARGAR PARA EDITAR *******************************

    cargarForm =(documentoId)=>{
        //  console.log (documentoId)
         db.collection('movimientos').doc(`${documentoId}`).get()
         .then((snap)=>{
        //    console.log(snap.data())
           this.setState({
             fecha : snap.data().fecha,
             codigo : snap.data().codigo,  
             producto: snap.data().producto,
             precioVenta: snap.data().precioVenta,
             cantidad: snap.data().cantidad,
             // productoEditarId : snap.id   *******esto igual funciona
             productoEditarId : documentoId
         })
        //  console.log(this.state)
          })
         .catch((error)=>{
             alert(error)
         })
    }
                    // CAPTURA CARGA DE CAMPOS EN PANTALLA *************************
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
        // if (evento.target.name== 'productoId'){
        //     console.log('obtenerCodigoProducto')
        //     let datosObtenidosProducto = this.obtenerDatosProducto(evento.target.value)
        //     console.log(datosObtenidosProducto)
        //     this.setState({
        //         codigo : datosObtenidosProducto.codigo,
        //         precioVenta : datosObtenidosProducto.precioVenta,
        //         precioCompra : datosObtenidosProducto.precioCompra,

        //     })
        // }
    }
    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})

    }
                        // GRABAR DATOS EN DB ***************************************
    guardar=()=>{
        // // console.log(this.state)
        // console.log(productoTemporal)
        let datosMovimmientos = {
            fecha:this.state.fecha,
            productoNombre:this.state.productoSeleccionado.productoNombre,
            productoId : this.state.productoSeleccionado.id,
            codigo:this.state.codigo,
            precioCompra:this.state.productoSeleccionado.precioCompra,
            precioVenta:this.state.precioVenta,
            cantidad:this.state.cantidad,
            tipoMovimiento: 2,
            estado: this.state.estado
        }

                                      // PARA GUARDAR
        if(this.state.codigo!=0 && this.state.fecha != '' && this.state.cantidad !=0){    
            db.collection('movimientos').add({
                ...datosMovimmientos, 
                creado : moment().unix(),
            })
            .then(()=>{
                // console.log(this.state.productoSeleccionado.Id)
                db.collection('productos').doc(this.state.productoSeleccionado.id).update({
                    saldo : this.state.productoSeleccionado.saldo - parseInt(this.state.cantidad)
                })
                .catch((error)=>{
                    // aqui hay que borrar en caso de que falle actualizacion de saldo en stock
                })
                // se ejecuta cuando se inserto con exito
                // alert('Insertado correctamente')  
                toast.success('Insertado correctamente', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                this.limpiarCampos()  
                this.closeModal()
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                // alert(error)
                console.log(error)
            })
        }else {
            alert('Los campos con * son obligatorios')  
        }
        
        // console.log (datosMovimmientos)
    }


                    // CARGA MOVIMIENTOS EN LISTA TEMPORAL *************************************************
    obtenerMovimientos = ()=>{
            let listaTemporal = []
            let sumatoriaTemporalPrecioCompra = 0
            let sumatoriaTemporalPrecioVenta = 0
            let metodoDesuscribirse = db.collection('movimientos').where('tipoMovimiento','==', 2).orderBy('creado')
            .onSnapshot((snap)=>{
                listaTemporal = []
                snap.forEach((documento)=>{
                    if (documento.data().estado==1){
                        sumatoriaTemporalPrecioCompra = sumatoriaTemporalPrecioCompra + parseInt( documento.data().precioCompra)
                        sumatoriaTemporalPrecioVenta = sumatoriaTemporalPrecioVenta + parseInt( documento.data().precioVenta)
                    }
                    listaTemporal.push({
                        id : documento.id,
                        creadoFormateado : moment.unix(documento.data().creado).format('DD/MM/YYYY'), 
                        ...documento.data()
                    })
                })
                // console.log(listaTemporal)
                this.setState({
                    listaMovimientos : listaTemporal.reverse(),
                    metodoDesuscribirse : metodoDesuscribirse,
                    totalPrecioCompra : sumatoriaTemporalPrecioCompra,
                    totalPrecioVenta : sumatoriaTemporalPrecioVenta                })
            },(error)=>{
                alert(error)
                console.log(error)
            })
    }
    renderListaProductos = () => {
        return this.state.listaProductos
        .filter((documento)=>{
            return (documento.productoNombre.toLowerCase().indexOf(this.state.productoNombre.toLowerCase())>=0)
        }) 

        .map((documento) => {
            return (
                // key es un identificador unico
                <tr key={documento.id}> 
                    <td>{documento.productoNombre}</td>
                    <td><a href="#" onClick={()=>{this.setState({productoSeleccionado:documento, codigo:documento.codigo, productoNombre:documento.productoNombre, precioVenta:documento.precioVenta, showModal: false })}}>
                        SELECCIONAR
                        </a></td>
                </tr>
            )
        })
    }


                    // ANTES DE DESMONTAR EL COMPONENTE******************************************************
    componentWillUnmount(){
        if (this.state.metodoDesuscribirse){
            this.state.metodoDesuscribirse()
        }
    }

                    // RENDERIZADO **************************************************************************
    render() {
        return (
            // *************************************** ESTO NO ME ACUERDO QUE MIERDA ERA *********************
            <>      
            <Form>
                {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"43%"}}> 
                    <h4>VENTAS</h4>
                </Row> */}
                <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000", paddingTop:5}}> 
                    <Col md = {5}></Col>
                        <Col md = {4}><h4>REGISTRO DE FAO</h4></Col>
                    <Col md = {5}></Col>
                </Row>
                <Row>
                <Col md={3}>
                        <Form.Group>
                                <Form.Label>Fecha *</Form.Label>
                                <Form.Control type="date"  size="sm" name="fecha" value = {this.state.fecha} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                         </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                                <Form.Label>Paciente *</Form.Label>
                                <Form.Control type="text"  size="sm" name="fecha" value = {this.state.fecha} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                         </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                                <Form.Label>Expediente *</Form.Label>
                                <Form.Control type="text"  size="sm" name="fecha" value = {this.state.fecha} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                         </Form.Group>
                    </Col>
                </Row>
                <Row>

                    <Col md={2}>
                           <Form.Group>
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="number"  size="sm"  name="codigo" value = {this.state.codigo} onChange={this.capturarTecla} disabled />
                               
                            </Form.Group>
                    </Col>
                    <Col md={3}>                
                        <Form.Group>
                            <Form.Label>Procedimiento * </Form.Label>
                            <Form.Control type="text" size="sm" name="productoNombre" value = {this.state.productoNombre} onChange={this.capturarTecla} onClick={this.openModal} />
                        </Form.Group>
                    </Col>
                    <Col md={1}> 
                            <Form.Group>
                                <Form.Label>Cant. *</Form.Label>
                                <Form.Control type="number"  size="sm" name="cantidad" value = {this.state.cantidad} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                            </Form.Group>                         
                    </Col>
                    <Col md={3}>                
                        <Form.Group>
                            <Form.Label>Procedimiento * </Form.Label>
                            <Form.Control type="text" size="sm" name="productoNombre" value = {this.state.productoNombre} onChange={this.capturarTecla} onClick={this.openModal} />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                             <Form.Group>
                                <Form.Label>Arancel</Form.Label>
                                {/* <Form.Control type="number"  size="sm" name="precioVenta" value = {this.state.precioVenta} onChange={this.capturarTecla} /> */}
                                <NumberFormat style = {{borderColor:'#f3f3f3', backgroundColor:'#fff', width:'150px', borderRadius:"4px"}} 
                                value={this.state.precioVenta} onValueChange ={(event)=>{this.capturarPrecio(event, "precioVenta" )}} thousandSeparator ={true} prefix={'G$'} />

                            </Form.Group>
                    </Col>
                    
                </Row>
                            
            </Form>

            {/* //  *******************************************BOTONES***************************************** */}
            <Row>
                    <Col md={8}>
                        <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                        <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                        {/* <Button className="float-right" style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.filtrar()}}>Filtrar</Button>{' '} */}
                        <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                        {/* <Button variant = "info" size="sm" onClick={() => {console.log('state', this.state)}}>Ver state</Button> */}
                        <PopupProductos 
                            propsShowModal={this.state.showModal} 
                            funcionCloseModal={this.closeModal} 
                            funcionCapturarTecla={this.capturarTecla} 
                            funcionGuardar={this.guardar}
                            funcionCapturarPrecio={this.capturarPrecio}
                            // listaProductos={this.state.listaProductos}
                            funcionRenderListaProductos={this.renderListaProductos}
                            funcionLimpiarCampos={this.limpiarCampos}
                            atributos = {this.state}/>

                    </Col>
                    <Col md={4}>
                         <Informe listaMovimientos = {this.state.listaMovimientos} tipoMovimiento = '2'/> 
                         {/* <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >filtrar</Tooltip>} > 
                            <MdFindInPage className="float-right" color="#3b5998" size="26" onClick ={()=>this.filtrar()} />  
                        </OverlayTrigger> */}

                    </Col>
            </Row>
            {/* //  ********************************************TABLA****************************************** */}
            <br/>
            <Row>
                <Col>
                        <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th style={{textAlign:"center"}}>Código  {this.state.mostrarFiltro==true? <Form.Control type="text" size="sm" name="filtroCodigo" value = {this.state.filtroCodigo} onChange={this.capturarTecla} />:null}</th>
                                            <th style={{textAlign:"center"}}>Producto  {this.state.mostrarFiltro==true?<Form.Control type="text" size="sm" name="filtroProductoNombre" value = {this.state.filtroProductoNombre} onChange={this.capturarTecla} />:null}</th>
                                            <th style={{textAlign:"center"}}>Precio Compra</th>
                                            <th style={{textAlign:"center"}}>Precio Venta</th>
                                            <th style={{textAlign:"center"}}>Cantidad</th>
                                            <th style={{textAlign:"center"}}>Fecha</th>
                                            <th style={{textAlign:"center"}}>Estado</th>
                                            <th style={{textAlign:"center"}}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderListaMovimientos()}
                                        <tr>
                                        <td></td>
                                        <td>TOTALES</td>
                                        <td style={{textAlign:"right"}}><NumberFormat value={this.state.totalPrecioCompra} displayType={'text'} thousandSeparator ={true} prefix={'G$'} /></td>
                                        <td style={{textAlign:"right"}}><NumberFormat value={this.state.totalPrecioVenta} displayType={'text'} thousandSeparator ={true} prefix={'G$'} /></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </tr>                                       
                                    </tbody>
                        </Table>
                </Col>
            </Row>
            <ToastContainer />
              
               
                
            </>
        )
    }
}

export default withRouter(ProductoVenta)