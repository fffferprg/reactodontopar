import React, { Component } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import Informe from '../../componentes/Informe';
import { MdDeleteForever, MdCreate } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import NumberFormat from 'react-number-format';




                    //  *************************STATES*********************

class ProductoStock extends Component {
    state={
        productoNombre:'',
        codigo:0,
        precioCompra:0,
        precioVenta:0,
        listaMovimientos: [],
        metodoDesuscribirse:null,
        productoEditarId: null,
        mostrarFiltro: false,// variable para mostrar y ocultar filtros 
        filtroCodigo:'',
        filtroProducto:'' 
       
    }

    filtrar = () =>{
        this.setState({mostrarFiltro:!this.state.mostrarFiltro})
   }

    confirmarAccion = (productoId) => {
        confirmAlert({
          title: 'Accion borrar',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.borrarProducto(productoId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      };

                    //********************************************LUEGO DE MONTAR EL COMPONENTE *******************************
    componentDidMount(){
        this.obtenerProducto()
    }
                    //********************************************CARGAR PARA EDITAR *******************************

    cargarForm =(productoId)=>{
        console.log (productoId)
        db.collection('productos').doc(`${productoId}`).get()
        .then((snap)=>{
          console.log(snap.data())
          this.setState({
            productoNombre: snap.data().productoNombre,
            precioCompra: snap.data().precioCompra,
            precioVenta: snap.data().precioVenta,
            codigo : snap.data().codigo,
            productoEditarId : snap.id
          })
         })
        .catch((error)=>{
            alert(error)
        })
    }
                    //*********************************************RENDERIZA LISTA DE MOVIMMIENTOS *****************************
    renderListaMovimientos = () => {
        return this.state.listaMovimientos
        .filter((documento)=>{
            return (documento.productoNombre.toLowerCase().indexOf(this.state.filtroProducto.toLowerCase())>=0)
        }) 
        .map((documento) => {
            return (
                // key es un identificador unico
                <tr key={documento.id}> 
                    <td>{documento.productoNombre}</td>
                    {/* <td>{documento.precioCompra}</td> */}
                    {/* <td>{documento.precioVenta}</td> */}
                    <td style={{textAlign:"center"}}> <NumberFormat value={documento.precioVenta} displayType={'text'} thousandSeparator={true} /></td>
                    {/* <td>{documento.creado}</td> */}
                    <td>{documento.saldo}</td>
                    {/* <td>{documento.codigo}</td> */}
                    {/* <td> <a href = '#' onClick ={()=>this.cargarForm(documento.id)}> Editar </a> | <a href = '#' onClick ={()=>this.confirmarAccion(documento.id)}> Borrar </a> </td> */}
                    {/* FcEditImage */}
                    {/* <td> <FcEditImage size="24" onClick ={()=>this.cargarForm(documento.id)} /> <FcEmptyTrash size="24" onClick ={()=>this.confirmarAccion(documento.id)} /></td> */}
                    {/* <td> <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} /> <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} /></td> */}
 
                    
                </tr>
            )
        })
    }
                    // *****************************************CAPTURA CARGA DE CAMPOS EN PANTALLA *************************
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }


                    //**************************************************GRABAR DATOS EN DB ***************************************
    guardar=()=>{
        // console.log(this.state)
        let datosMovimmientos = {
            productoNombre:this.state.productoNombre,
            precioCompra:this.state.precioCompra,
            precioVenta:this.state.precioVenta,
            codigo:this.state.codigo,
            
        }
        if(this.state.productoEditarId) {
                        
            db.collection('productos').doc(`${this.state.productoEditarId}`).update(datosMovimmientos)
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                alert('Editado correctamente')
                this.limpiarCampos()    
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
            // console.log(datosMovimmientos)       

        } else{
            //   console.log({...datosMovimmientos, creado: firebase.firestore.FieldValue.serverTimestamp()})                
            db.collection('productos').add({...datosMovimmientos, saldo : 0, creado: moment().unix()})
            .then(()=>{
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
                    //******************************BORRAR PRODUCTO *************************************************
    borrarProducto = (productoId) =>{
        console.log(productoId)
        db.collection('productos').doc(productoId).delete()
        .then(()=>{
            // se ejecuta cuando se inserto con exito
            alert('Eliminado correctamente')    

        })
        .catch((error)=>{
            // se ejecuta cuando sucede un error 
            alert(error)
        })
    }



                    //******************************CARGA MOVIMIENTOS EN LISTA TEMPORAL *************************************************
    obtenerProducto = ()=>{
            let listaTemporal = []
            // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
            db.collection('productos').orderBy('creado')
            .onSnapshot((snap)=>{
                listaTemporal = []
                snap.forEach((documento)=>{
                    let producto = {
                        id : documento.id,
                        productoNombre : documento.data().productoNombre,
                        precioCompra : documento.data().precioCompra,
                        precioVenta : documento.data().precioVenta,
                        codigo : documento.data().codigo,
                        // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                        creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                        saldo : documento.data().saldo
                    }
                    listaTemporal.push(producto)
                    console.log (producto)
                })
                this.setState({
                    listaMovimientos : listaTemporal,
                    // metodoDesuscribirse : metodoDesuscribirse
                })
            },(error)=>{
                alert(error)
                console.log(error)
            })
    }
                        // ************************************LIMPIAR CAMPOS******************************************************

    limpiarCampos=()=>{
        this.setState({
            productoNombre:'',
            precioCompra:0,
            precioVenta:0,
            codigo:0,
            productoEditarId: null
        })
    }

                    // ************************************ANTES DE DESMONTAR EL COMPONENTE******************************************************
    //  componentWillUnmount(){
    //      if (this.state.metodoDesuscribirse){
    //           this.state.metodoDesuscribirse()
    //      }}
    

                    // ************************************RENDERIZADO **************************************************************************
    render() {
        return (
            // *************************************** ESTO ES IGUAL A <div> *********************
            // <div style={{backgroundColor:"#3b5998"}}>      
            <div>      

                <Form>
                    {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}>  */}
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>STOCK</h4></Col>
                   
                    </Row>

                    <Row>
                    
                        <Col md={12} sm = {12} xs = {12}>
                                    <Form.Group>
                                        <Form.Label>Producto</Form.Label>
                                        <Form.Control type="text" size="sm"  name="filtroProducto" value = {this.state.filtroProducto} onChange={this.capturarTecla} />
                                    
                                    </Form.Group>

                        </Col> 
                        {/* <Col md={6} sm = {2} xs = {4}>
                            <Button style ={{marginTop : "6%"}}variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>

                        </Col> */}
                       
                    
                    </Row>
                                
                </Form>

                {/* //  *******************************************BOTONES***************************************** */}
                <Row>
                        <Col md={8}>
                            {/* <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '} */}
                            {/* <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '} */}
                            {/* <Button className="float-right" style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.filtrar()}}>Filtrar</Button>{' '} */}
                            {/* <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button> */}

                        </Col>
                        <Col >
                         {/* <Informe listaMovimientos = {this.state.listaMovimientos} />            */}
                    </Col>
                </Row>
                <br/>
                {/* //  ********************************************TABLA****************************************** */}
                <Row>
                    <Col>
                            <Table striped bordered hover >
                                        <thead>
                                            <tr>
                                                {/* <th>Producto</th> */}
                                                <th>Producto  {this.state.mostrarFiltro==true?<Form.Control type="text"  name="filtroProducto" value = {this.state.filtroProducto} onChange={this.capturarTecla} />:null}</th>
                                                {/* <th>Precio Compra</th> */}
                                                <th>Precio Venta</th>
                                                {/* <th>Creado</th> */}
                                                <th>Saldo</th>
                                                {/* <th>Codigo</th> */}
                                                {/* <th>Entradas</th>
                                                <th>Salidas</th>
                                                <th>Stock</th> */}
                                                {/* <th>Acciones</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderListaMovimientos()}                                       
                                        </tbody>
                            </Table>
                    </Col>
                </Row>
              
                <ToastContainer />

                
            </div>
        )
    }
}

export default withRouter(ProductoStock)