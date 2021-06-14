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
import PopupCompras from '../producto/PopupCompras';




                    //  *************************STATES*********************

class ProductoCompra extends Component {
    state={
        fecha:'',
        productoId:'',
        codigo:'0',
        precioCompra:'0',
        cantidad:0,
        tipoMovimiento: 1,
        estado: 1,            // estado 1 = activo / 0 = anulado
        listaMovimientos: [],
        listaProductos: [],
        metodoDesuscribirse:null,
        productoEditarId: null,
        mostrarFiltro: false,// variable para mostrar y ocultar filtros 
        filtroCodigo:'',
        filtroProductoNombre:'',
        titulo:'',
        showModal: false
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
            productoId:'',
            codigo:0,
            precioCompra:0,
            cantidad:0,
            tipoMovimiento: 1,
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
            this.restarSaldoStock(productoId, cantidad)
        })
        .catch((error)=>{
            alert(error)
        })
    }
  
    restarSaldoStock =(productoId, cantidad)=>{
        let saldoActualProducto = this.obtenerSaldoProducto(productoId)
        console.log(saldoActualProducto)
        let saldoFinal = saldoActualProducto - parseInt(cantidad)
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
                    {/* <td style={{textAlign:"center"}}>{documento.precioCompra}</td> */}
                    <td style={{textAlign:"right"}}> <NumberFormat value={documento.precioCompra} displayType={'text'} thousandSeparator={true} /></td>
                    <td style={{textAlign:"center"}}>{documento.cantidad}</td>
                    <td style={{textAlign:"center"}}>{moment(documento.fecha).format('DD/MM/YYYY')}</td>
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
obtenerCodigoProducto = (productoId) =>{
    let productoTemporal = this.state.listaProductos.filter(producto =>{
        return producto.id == productoId
        
    })
    let codigoProducto = productoTemporal[0].codigo
    return codigoProducto
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
             precioCompra: snap.data().precioCompra,
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
        // console.log('evento', evento)
        this.setState({[evento.target.name]:evento.target.value})

        if (evento.target.name== 'productoId'){
            console.log('obtenerCodigoProducto')
            let codigoObtenido = this.obtenerCodigoProducto(evento.target.value)
            console.log(codigoObtenido)
            this.setState({
                codigo : codigoObtenido
            })
        }
    }
    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})

    }

                        // GRABAR DATOS EN DB ***************************************
    guardar=()=>{
        // // console.log(this.state)
        let productoTemporal = this.state.listaProductos.filter(producto =>{
            return producto.id == this.state.productoId
        })
        // console.log(productoTemporal)
        let datosMovimmientos = {
            fecha:this.state.fecha,
            productoNombre:productoTemporal[0].productoNombre,
            productoId : this.state.productoId,
            codigo:this.state.codigo,
            precioCompra:this.state.precioCompra,
            cantidad:this.state.cantidad,
            tipoMovimiento: 1,
            estado: this.state.estado
        }
        if (this.state.productoEditarId){       // PARA EDITAR 
            // console.log(this.state.productoEditarId)
            db.collection('movimientos').doc(`${this.state.productoEditarId}`).update(datosMovimmientos)
            //    db.collection("movimientos").doc(`${this.state.productoEditarId}`).update({
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                // alert('Editado correctamente')  
                toast.success('Editado correctamente', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                this.limpiarCampos()  
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
                // console.log(error)
            })    
        } else{                                 // PARA GUARDAR
            
            db.collection('movimientos').add({
                ...datosMovimmientos, 
                // creado: firebase.firestore.FieldValue.serverTimestamp()
                creado : moment().unix(),
                // saldo : 
            })
            .then(()=>{
                db.collection('productos').doc(this.state.productoId).update({
                    saldo : productoTemporal[0].saldo + parseInt(this.state.cantidad)
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
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
        }
        
        // console.log (datosMovimmientos)
    }


                    // CARGA MOVIMIENTOS EN LISTA TEMPORAL *************************************************
    obtenerMovimientos = ()=>{
            let listaTemporal = []
            let metodoDesuscribirse = db.collection('movimientos').where('tipoMovimiento','==', 1).orderBy('creado')
            .onSnapshot((snap)=>{
                listaTemporal = []
                snap.forEach((documento)=>{
                    listaTemporal.push({
                        id : documento.id,
                        creadoFormateado : moment.unix(documento.data().creado).format('DD/MM/YYYY'), 
                        ...documento.data()
                    })
                })
                // console.log(listaTemporal)
                this.setState({
                    listaMovimientos : listaTemporal,
                    metodoDesuscribirse : metodoDesuscribirse
                })
            },(error)=>{
                alert(error)
                console.log(error)
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
                    <h4>COMPRAS</h4>
                </Row> */}
                {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000", paddingTop:5}}> 
                    <Col md = {5}></Col>
                        <Col md = {4}><h4>COMPRAS</h4></Col>
                    <Col md = {5}></Col>

                </Row> */}
                <Row>
                    <Col md={3}>
                        <Form.Group>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date"  size="sm" name="fecha" value = {this.state.fecha} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                         </Form.Group>
                    </Col>
                    <Col>                
                      {/* // *********AQUI DEBERIA TRAER DE LA COLLECTION PRODUCTOS ************************/}
                        <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Producto</Form.Label>
                                <Form.Control as="select"  size="sm"  name="productoId" value = {this.state.productoNombre}  onChange={this.capturarTecla}>
                                <option key= '01' value = '01'>Seleccione un producto</option>
                                    {this.renderItems()}
                                </Form.Control>
                        </Form.Group>
                    </Col>
                                                            
                    <Col md={1}>
                           <Form.Group>
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="number"  size="sm"  name="codigo" value = {this.state.codigo} onChange={this.capturarTecla} disabled />
                               
                            </Form.Group>
                    </Col>

                    <Col md={2}>
                             <Form.Group>
                                <Form.Label>Precio Compra</Form.Label>
                                {/* <Form.Control type="number"  size="sm" name="precioCompra" value = {this.state.precioCompra} onChange={this.capturarTecla} /> */}
                                <NumberFormat style = {{borderColor:'#f3f3f3', backgroundColor:'#fff', width:'150px', borderRadius:"4px"}} 
                                value={this.state.precioCompra} onValueChange ={(event)=>{this.capturarPrecio(event, "precioCompra" )}} thousandSeparator ={true} prefix={'G$'} />
                              
                            </Form.Group>
                    </Col>
                    <Col md={2}> 

                            <Form.Group>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number"  size="sm" name="cantidad" value = {this.state.cantidad} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                            </Form.Group>                         

                    </Col>
                    
                </Row>
                            
            </Form>

            {/* //  *******************************************BOTONES***************************************** */}
            <Row>
                    <Col md={8}>
                        {/* <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                        <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                        <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button> */}
                        <Button className="btn btn-primary" size="sm" onClick={this.openModal} >CARGAR</Button>
                        <PopupCompras propsShowModal={this.state.showModal} funcionCloseModal={this.closeModal} funcionGuardar={this.guardar}/>

                    </Col>
                    <Col md={4}>
                         <Informe listaMovimientos = {this.state.listaMovimientos} tipoMovimiento = '1'/> 
                         <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >filtrar</Tooltip>} > 
                            <MdFindInPage className="float-right" color="#3b5998" size="26" onClick ={()=>this.filtrar()} />  
                        </OverlayTrigger>

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
                                            <th style={{textAlign:"center"}}>Cantidad</th>
                                            <th style={{textAlign:"center"}}>Fecha</th>
                                            <th style={{textAlign:"center"}}>Estado</th>
                                            <th style={{textAlign:"center"}}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderListaMovimientos()}                                       
                                    </tbody>
                        </Table>
                </Col>
            </Row>
            <ToastContainer />
              
               
                
            </>
        )
    }
}

export default withRouter(ProductoCompra)