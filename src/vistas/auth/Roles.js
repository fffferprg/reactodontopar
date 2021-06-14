import React, { Component } from 'react';
import { Row, Col, Form, Button, Table , Badge } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import {db} from '../../config/admorganizacion';
import moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; 
import { ToastContainer, toast } from 'react-toastify';
import Informe from '../../componentes/Informe';
import { MdDeleteForever, MdCreate } from "react-icons/md";


                    //  *************************STATES*********************

class Roles extends Component {
    state={
        nombreRol : '',
        listaRoles : []

    }

   
    limpiarCampos = () => {
        this.setState({
            nombreRol : ''
 
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

                    // LUEGO DE MONTAR EL COMPONENTE *******************************
    componentDidMount(){
        this.obtenerRoles()

    }


    obtenerRoles =()=>{
        let listaRolesTemporal = []
        db.collection('roles').get()
        .then((roles)=>{
            roles.forEach((rol)=>{
                listaRolesTemporal.push({
                    id : rol.id,
                    ...rol.data()      
                    // producto : producto.producto  // ES LO MISMO QUE LA LINEA ANTERIOR
                })
            })
            this.setState({
                listaRoles : listaRolesTemporal
            })
            console.log(listaRolesTemporal)
        })
        .catch((error)=>{
            alert(error)
        })
    }


                    // RENDERIZA LISTA DE MOVIMMIENTOS *****************************
    renderListaRoles = () => {
        return this.state.listaRoles
        .map((documento) => {
            // console.log(documento)
            return (
                // key es un identificador unico
                    <tr key={documento.id}> 
                    <td>{documento.nombreRol}</td>
                    <td>{moment.unix(documento.creado).format('DD/MM/YYYY')}</td>
                    {/* <td> <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} /> <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} /></td> */}
                </tr>
            )
        })
    }


    //                     //********************************************CARGAR PARA EDITAR *******************************

    // cargarForm =(documentoId)=>{
    //     //  console.log (documentoId)
    //      db.collection('movimientos').doc(`${documentoId}`).get()
    //      .then((snap)=>{
    //     //    console.log(snap.data())
    //        this.setState({
    //          fecha : snap.data().fecha,
    //          codigo : snap.data().codigo,  
    //          producto: snap.data().producto,
    //          precioCompra: snap.data().precioCompra,
    //          cantidad: snap.data().cantidad,
    //          // productoEditarId : snap.id   *******esto igual funciona
    //          productoEditarId : documentoId
    //      })
    //     //  console.log(this.state)
    //       })
    //      .catch((error)=>{
    //          alert(error)
    //      })
    // }
                    // CAPTURA CARGA DE CAMPOS EN PANTALLA *************************
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }


                    // GRABAR DATOS EN DB ***************************************
    guardar=()=>{
        // console.log(this.state)
        let datosRol = {
            nombreRol : this.state.nombreRol
        }
        // if (this.state.productoEditarId){       // PARA EDITAR 
        //     // console.log(this.state.productoEditarId)
        //     db.collection('movimientos').doc(`${this.state.productoEditarId}`).update(datosMovimmientos)
        //     //    db.collection("movimientos").doc(`${this.state.productoEditarId}`).update({
        //     .then(()=>{
        //         // se ejecuta cuando se inserto con exito
        //         // alert('Editado correctamente')  
        //         toast.success('Editado correctamente', {
        //             position: "bottom-right",
        //             autoClose: 3000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //             });
        //         this.limpiarCampos()  
        //     })
        //     .catch((error)=>{
        //         // se ejecuta cuando sucede un error 
        //         alert(error)
        //         // console.log(error)
        //     })    
        // } else{                                 // PARA GUARDAR
     
            db.collection('roles').add({
                ...datosRol, 
                creado : moment().unix()
            })
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                // alert('Insertado correctamente')  
                this.obtenerRoles()
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
                alert(error)
            })
        // }
        
        // console.log (datosMovimmientos)
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
                <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000", paddingTop:5}}> 
                    <Col md = {5}></Col>
                        <Col><h4>ROLES</h4></Col>
                    <Col md = {5}></Col>

                </Row>
                <Row>
                   
                    <Col md={4}> 

                            <Form.Group>
                                <Form.Label>Nombre Rol</Form.Label>
                                <Form.Control type="text"  size="sm" name="nombreRol" value = {this.state.nombreRol} onChange={this.capturarTecla} />
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
                        <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                        <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                        {/* <Button className="float-right" style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.filtrar()}}>Filtrar</Button>{' '} */}
                        <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                        </Col>
                    {/* <Col md={4}>
                         <Informe listaMovimientos = {this.state.listaMovimientos} tipoMovimiento = '1'/>           
                    </Col> */}
            </Row>
            {/* //  ********************************************TABLA****************************************** */}
            <br/>
            <Row>
                <Col>
                        <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Nombre Rol </th>
                                            <th>Creado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderListaRoles ()}                                       
                                    </tbody>
                        </Table>
                </Col>
            </Row>
            <ToastContainer />
              
               
                
            </>
        )
    }
}

export default withRouter(Roles)