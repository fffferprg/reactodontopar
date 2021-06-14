import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; 
import Informe from '../../componentes/Informe';
import { MdDeleteForever, MdCreate } from "react-icons/md";


                    //  *************************STATES*********************

class ProductoVenta extends Component {
    state={
        fecha:'',
        productoId:'',
        codigo:0,
        precioVenta:0,
        cantidad:0,
        tipoMovimiento: 2,
        listaProductos: [],
        listaMovimientos: [],
        metodoDesuscribirse:null,
        productoEditarId: null,
        filtroCodigo:'',
        estado : 1,
        mostrarFiltro: false,// variable para mostrar y ocultar filtros 
        filtroProducto:'' 
       
    }

    //************************INVIERTE EL VALOR DEL STATE PARA MOSTRAR FILTRO */
    filtrar = () =>{
        this.setState({mostrarFiltro:!this.state.mostrarFiltro})
    }


                    // LUEGO DE MONTAR EL COMPONENTE *******************************
    componentDidMount(){
        this.obtenerMovimientos()
        this.obtenerProductos() 
    }

    limpiarCampos = () => {
        this.setState({
            fecha:'',
            producto:'01',
            codigo:0,
            precioVenta:0,
            cantidad:0,
            tipoMovimiento: 2,
            metodoDesuscribirse:null,
            productoEditarId: null,
            estado : 1
        })
    }

    obtenerProductos =()=>{
        let listaProductosTemporal = []
        db.collection('productos').get()
        .then((productos)=>{
            productos.forEach((producto)=>{
                listaProductosTemporal.push({
                    id : producto.id,
                    ...producto.data()      
                    // producto : producto.producto  // ES LO MISMO QUE LA LINEA ANTERIOR
                })
            })
            this.setState({
                listaProductos : listaProductosTemporal
            })
            console.log(this.state.listaProductos)
        })
        .catch((error)=>{
            alert(error)
        })
    }

    confirmarAccion = (movimientoId) => {
        confirmAlert({
          title: 'Accion anular',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.anularMovimiento(movimientoId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      };

      anularMovimiento =(movimientoId) => {
        console.log(movimientoId)
        let datosNuevos = {
            estado : 0
        }
        db.collection('movimientos').doc(movimientoId).update(datosNuevos)
        .catch((error)=>{
            alert(error)
        })

    }

    renderItems =() => {
        return this.state.listaProductos.map((producto)=>{
            return (
            <option key={producto.id} value = {producto.id}>{producto.productoNombre}</option>
            )
        }) 
    }

                    // RENDERIZA LISTA DE MOVIMMIENTOS *****************************
    //  renderListaMovimientos = () => {
    //      return this.state.listaMovimientos.map((documento) => {
        renderListaMovimientos = () => {
            return this.state.listaMovimientos
            // .filter((documento)=>{
            //     return (documento.codigo.toString().indexOf(this.state.filtroCodigo)>=0) 
            //     && (documento.producto.toLowerCase().indexOf(this.state.filtroProducto.toLowerCase())>=0)
            // }) 
            .map((documento) => {         
    return (
                 // key es un identificador unico
                     <tr key={documento.id}> 
                     <td>{documento.codigo}</td>
                     <td>{documento.productoNombre}</td>
                     <td>{documento.precioVenta}</td>
                     <td>{documento.cantidad}</td>
                     <td>{moment(documento.fecha).format('DD/MM/YYYY')}</td>
                     <td>{documento.estado==1?<Badge pill variant="info"> Activo </Badge>:<Badge pill variant="danger"> Anulado </Badge>}</td>
                     {/* <td> <a href = '#' onClick ={()=>this.cargarForm(documento.id)}> Editar </a> {documento.estado==0?null:<a href = '#' onClick ={()=>this.confirmarAccion(documento.id)}>| Anular </a>} </td> */}
                     <td> <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} /> <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} /></td>

                 </tr>
             )
         })
     }
                    // CAPTURA CARGA DE CAMPOS EN PANTALLA *************************
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }


                    // GRABAR DATOS EN DB ***************************************
    guardar=()=>{
          // console.log(this.state)
          let productoTemporal = this.state.listaProductos.filter(producto =>{
            // console.log(producto.id == 'rAufx7TUgoiiPB7Ehnon')
            // console.log(this.state.productoId)
            console.log(producto.id == this.state.productoId)
            return producto.id == this.state.productoId
            
        })
          let datosMovimmientos = {
            fecha:this.state.fecha,
            productoNombre:productoTemporal[0].productoNombre,
            productoId:this.state.productoId,
            codigo:this.state.codigo,
            precioVenta:this.state.precioVenta,
            cantidad:this.state.cantidad,
            tipoMovimiento: 2,
            estado: this.state.estado
        }
        if (this.state.productoEditarId){       // PARA EDITAR 
            console.log(this.state.productoEditarId)
            db.collection('movimientos').doc(`${this.state.productoEditarId}`).update(datosMovimmientos)
            //    db.collection("movimientos").doc(`${this.state.productoEditarId}`).update({
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                // alert('Editado correctamente')  
                toast.success('Editado correctamente', {
                    position: "bottom-right",
                    autoClose: 3000,
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
                console.log(error)
            })    
        } else{                                 // PARA GUARDAR
     
            db.collection('movimientos').add({
                ...datosMovimmientos, 
                // creado: firebase.firestore.FieldValue.serverTimestamp()
                creado : moment().unix()
            })
            .then(()=>{
                db.collection('productos').doc(this.state.productoId).update({
                    saldo : productoTemporal[0].saldo - parseInt(this.state.cantidad)
                })
                // se ejecuta cuando se inserto con exito
                // alert('Insertado correctamente')  
                toast.success('Insertado correctamente', {
                    position: "bottom-right",
                    autoClose: 3000,
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
                // alert(error)
                toast.danger(error, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            })
        }
        
        // console.log (datosMovimmientos)
    }

   //********************************************CARGAR PARA EDITAR **************************
   cargarForm =(documentoId)=>{
     console.log (documentoId)
     db.collection('movimientos').doc(`${documentoId}`).get()
     .then((snap)=>{
       console.log(snap.data())
       this.setState({
          fecha : snap.data().fecha,
         codigo : snap.data().codigo,  
         producto: snap.data().producto,
         precioVenta: snap.data().precioVenta,
         cantidad: snap.data().cantidad,
         // productoEditarId : snap.id   *******esto igual funciona
         productoEditarId : documentoId
     })
     console.log(this.state)
     })
     .catch((error)=>{
         alert(error)
     })
}

                    // CARGA MOVIMIENTOS EN LISTA TEMPORAL *************************************************
    obtenerMovimientos = ()=>{
            let listaTemporal = []
            let metodoDesuscribirse = db.collection('movimientos').where('tipoMovimiento','==', 2).orderBy('creado')
            .onSnapshot((snap)=>{
                listaTemporal = []
                snap.forEach((documento)=>{
                    listaTemporal.push({
                        id : documento.id,
                        creadoFormateado : moment.unix(documento.data().creado).format('DD-MM-YYYY'), 
                        ...documento.data()
                    })
                })
                this.setState({
                    listaMovimientos : listaTemporal,
                    metodoDesuscribirse : metodoDesuscribirse
                })
                console.log('listaTemporal: ', listaTemporal)
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
            <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000", paddingTop:5}}> 
                    <Col md = {5}></Col>
                        <Col><h4>VENTAS</h4></Col>
                    <Col md = {5}></Col>

                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Group>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date" size="sm" name="fecha" value = {this.state.fecha} onChange={this.capturarTecla} />
                                {/* <Form.Text className="text-muted">
                                    Campo obligatorio
                                </Form.Text> */}
                         </Form.Group>
                    </Col>
                    <Col>                
                      {/* // *********AQUI DEBERIA TRAER DE LA COLLECTION PRODUCTOS ************************/}
                      <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Producto</Form.Label>
                                <Form.Control as="select"  size="sm"  name="productoId" value = {this.state.productoId}  onChange={this.capturarTecla}>
                                <option key= '01' value = '01'>Seleccione un producto</option>
                                    {this.renderItems()}
                                </Form.Control>
                        </Form.Group>
                    </Col>
                                                            
                    <Col md={1}>
                           <Form.Group>
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="number"  size="sm" name="codigo" value = {this.state.codigo} onChange={this.capturarTecla} />
                               
                            </Form.Group>
                    </Col>

                    <Col md={2}>
                             <Form.Group>
                                <Form.Label>Precio Venta</Form.Label>
                                <Form.Control type="number"  size="sm" name="precioVenta" value = {this.state.precioVenta} onChange={this.capturarTecla} />
                              
                            </Form.Group>
                    </Col>
                    <Col md={2}> 

                        <Form.Group>
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control type="number"  size="sm" name="cantidad" value = {this.state.cantidad} onChange={this.capturarTecla} />
                            
                        </Form.Group>                         

                    </Col>
                </Row>
                            
            </Form>

            {/* //  *******************************************BOTONES***************************************** */}
            <Row>
                    <Col md={8}>
                    <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                        <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                        <Button className="float-right" style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.filtrar()}}>Filtrar</Button>{' '}
                        <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                    </Col>
                    <Col >
                         <Informe listaMovimientos = {this.state.listaMovimientos} tipoMovimiento = '2'/>           
                    </Col>
            </Row>
            {/* //  ********************************************TABLA****************************************** */}
            <br/>
            <Row>
                <Col>
                        <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            {/* <th>Código</th> */}
                                            <th>Código  {this.state.mostrarFiltro==true?
                                            <Form.Control type="text" size="sm" name="filtroCodigo" value = {this.state.filtroCodigo} onChange={this.capturarTecla} />
                                            :null}
                                            </th>
                                            {/* <th>Producto</th> */}
                                            <th>Producto  {this.state.mostrarFiltro==true?<Form.Control type="text" size="sm" name="filtroProducto" value = {this.state.filtroProducto} onChange={this.capturarTecla} />:null}</th>
                                            <th>Precio Venta</th>
                                            <th>Cantidad</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderListaMovimientos()}                                       
                                    </tbody>
                        </Table>
                </Col>
            </Row>
            <ToastContainer/>
               
                
            </>
        )
    }
}

export default withRouter(ProductoVenta)