import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';


class ClienteAbm extends Component {
    state={
        clienteNombre:'',
        clienteCodigo:'',
        clienteDocumento:'',
        clienteTelefono:'',
        mostrarFiltro:true,
        filtroClienteNombre:'',
        listaMovimientos: [],
        clienteEditarId:null,
        clienteEmail:'',
        clienteFechaNacimiento:'', 
        clienteEmpleadoNombre:'',
        clienteCarnetEmpleado:'',
    }


    componentDidMount(){
        this.obtenerClientes()
    }

    obtenerClientes = ()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('clientes').orderBy('creado')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                let cliente = {
                    id : documento.id,
                    clienteNombre : documento.data().clienteNombre,
                    clienteCodigo : documento.data().clienteCodigo,
                    clienteDocumento : documento.data().clienteDocumento,
                    clienteFechaNacimiento: documento.data().clienteFechaNacimiento,
                    // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                    creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                    clienteTelefono : documento.data().clienteTelefono,
                    clienteEmail : documento.data().clienteEmail,
                    clienteCarnetEmpleado : documento.data().clienteCarnetEmpleado,
                    clienteEmpleadoNombre : documento.data().clienteEmpleadoNombre,
                }
                listaTemporal.push(cliente)
                // console.log ('MOVIMIENTOS:', cliente)
            })
            this.setState({
                listaMovimientos : listaTemporal.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
        },(error)=>{
            alert(error)
            console.log(error)
        })
}


renderListaMovimientos = () => {
    return this.state.listaMovimientos
    .filter((documento)=>{
        return (documento.clienteNombre.toLowerCase().indexOf(this.state.filtroClienteNombre.toLowerCase())>=0)
    }) 
    .map((documento) => {
        return (
            // key es un identificador unico
            <tr key={documento.id}> 
                <td>{documento.clienteNombre}</td>
                <td>{documento.clienteCodigo}</td>
                <td>{documento.clienteDocumento}</td>
                <td style={{textAlign:"center"}}>{documento.clienteFechaNacimiento}</td>
                <td>{documento.clienteTelefono}</td>
                <td>{documento.clienteEmail}</td>
                <td>{documento.clienteCarnetEmpleado}</td>
                <td>{documento.clienteEmpleadoNombre}</td>
                <td style={{textAlign:"center"}}> 
                        <div>
                            <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Editar</Tooltip>} > 
                                <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} />
                            </OverlayTrigger>
                            {' '}  
                            {/* <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Borrar</Tooltip>} > 
                                <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} />
                            </OverlayTrigger> */}
                        </div>
                       
                </td>
            </tr>
        )
    })
}

    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }

    cargarForm =(clienteId)=>{
        console.log (clienteId)
        db.collection('clientes').doc(`${clienteId}`).get()
        .then((snap)=>{
          console.log(snap.data())
          this.setState({
            clienteNombre: snap.data().clienteNombre,
            clienteDocumento: snap.data().clienteDocumento,
            clienteTelefono: snap.data().clienteTelefono,
            clienteCodigo : snap.data().clienteCodigo,
            clienteEditarId : snap.id,
            clienteEmail:snap.data().clienteEmail,
            clienteFechaNacimiento:snap.data().clienteFechaNacimiento,
            clienteCarnetEmpleado:snap.data().clienteCarnetEmpleado,
            clienteEmpleadoNombre:snap.data().clienteEmpleadoNombre,
          })
        //   console.log('EDITAR', this.state.clienteEditarId)
        console.log('ESTADO',this.state)
         })
        .catch((error)=>{
            alert(error)
        })
    }

    confirmarAccion = (clienteId) => {
        confirmAlert({
          title: 'Accion borrar',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.borrarCliente(clienteId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      }

      borrarCliente = (clienteId) =>{
        console.log(clienteId)
        db.collection('clientes').doc(clienteId).delete()
        .then(()=>{
            // se ejecuta cuando se inserto con exito
            alert('Eliminado correctamente')   
            this.obtenerProducto() 

        })
        .catch((error)=>{
            // se ejecuta cuando sucede un error 
            alert(error)
        })
    }

    limpiarCampos = () => {
        this.setState({
            clienteNombre:'',
            clienteCodigo:'',
            clienteDocumento:'',
            clienteTelefono:'',
            mostrarFiltro:true,
            filtroClienteNombre:'',
            clienteEditarId:null,
            clienteEmail:'',
            clienteFechaNacimiento:'',
            clienteCarnetEmpleado:'',
            clienteEmpleadoNombre:'',
        })
    }

    guardar=()=>{
        // // console.log(this.state)
        // console.log(productoTemporal)
        let datosMovimmientos = {
            clienteNombre:this.state.clienteNombre,
            clienteCodigo:this.state.clienteCodigo,
            clienteDocumento:this.state.clienteDocumento,
            clienteFechaNacimiento:this.state.clienteFechaNacimiento,
            clienteTelefono:this.state.clienteTelefono,
            clienteEmail:this.state.clienteEmail,
            clienteCarnetEmpleado:this.state.clienteCarnetEmpleado,
            clienteEmpleadoNombre:this.state.clienteEmpleadoNombre,
        }
        if(this.state.clienteEditarId && this.state.clienteNombre!='' && this.state.clienteDocumento!= '' && this.state.clienteCodigo!=0) {
            db.collection('clientes').doc(`${this.state.clienteEditarId}`).update(datosMovimmientos)
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                alert('Editado correctamente')
                this.limpiarCampos()  
                this.obtenerClientes()  
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
            // console.log(datosMovimmientos)       

        } else{
                                      // PARA GUARDAR
            if(this.state.clienteNombre!='' && this.state.clienteDocumento!= '' 
            && this.state.clienteCodigo!=0 && this.state.clienteTelefono!=0){    
                db.collection('clientes').add({
                    ...datosMovimmientos, 
                    creado : moment().unix(),
                })
                .then(()=>{
                    // console.log (datosMovimmientos)
                    // console.log(this.state.productoSeleccionado.Id)
                //     db.collection('productos').doc(this.state.productoSeleccionado.id).update({
                //     saldo : this.state.productoSeleccionado.saldo - parseInt(this.state.cantidad)
                //     })
                // .catch((error)=>{
                        // aqui hay que borrar en caso de que falle actualizacion de saldo en stock
                // })
                    // se ejecuta cuando se inserto con exito
                    // alert('Insertado correctamente') 
                    this.limpiarCampos()  
                    this.obtenerClientes()   
                    toast.success('Insertado correctamente', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });


                    // this.closeModal()
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
    }

    render() {
        return (
            <div>
                 <Form>
                    {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}>  */}
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>PACIENTES</h4></Col>
                   
                    </Row>

                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>EXPEDIENTE *</Form.Label>
                                <Form.Control type="text" size="sm"  name="clienteCodigo" value = {this.state.clienteCodigo} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>NOMBRE *</Form.Label>
                                <Form.Control type="text" size="sm"  name="clienteNombre" value = {this.state.clienteNombre} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col> 
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>DOCUMENTO *</Form.Label>
                                <Form.Control type="number" size="sm"  name="clienteDocumento" value = {this.state.clienteDocumento} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>TELEFONO *</Form.Label>
                                <Form.Control type="text" size="sm"  name="clienteTelefono" value = {this.state.clienteTelefono} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col>
                            <Form.Group controlId="formEmail">
                                <Form.Label>EMAIL</Form.Label>
                                <Form.Control type="email" size="sm" placeholder="Introduzca su email" name="clienteEmail" value={this.state.clienteEmail} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                    <Form.Label>FEC NACIMIENTO * </Form.Label>
                                    <Form.Control type="date"  size="sm" name="clienteFechaNacimiento" value = {this.state.clienteFechaNacimiento} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>Carnet Empleado *</Form.Label>
                                <Form.Control type="text" size="sm"  name="clienteCarnetEmpleado" value = {this.state.clienteCarnetEmpleado} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label>NOMBRE *</Form.Label>
                                <Form.Control type="text" size="sm"  name="clienteEmpleadoNombre" value = {this.state.clienteEmpleadoNombre} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col> 
                        <Col md={4} sm = {12} xs = {12} >
                                <Button style={{ marginTop:"30px", backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                                <Button style={{ marginTop:"30px", backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                                <Button style={{marginTop:"30px"}} variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                                <Table striped bordered hover size="sm" >
                                            <thead>
                                                <tr>
                                                    {/* <th>Producto</th> */}
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Nombre" name="filtroClienteNombre" value = {this.state.filtroClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                                    {/* <th>Precio Compra</th> */}
                                                    <th>Expediente</th>
                                                    {/* <th>Creado</th> */}
                                                    <th>Documento</th>
                                                    <th>Fec.Nacimiento</th>
                                                    <th>Telefono</th>
                                                    <th>Email</th>
                                                    <th>Carnet</th>
                                                    <th>Nombre</th>
                                                    {/* <th>Entradas</th>
                                                    <th>Salidas</th>
                                                    <th>Stock</th> */}
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderListaMovimientos()}                                       
                                            </tbody>
                                </Table>
                        </Col>
                    </Row>
                    <ToastContainer />            
                </Form>
            </div>
        )
    }
}
export default  withRouter(ClienteAbm)
