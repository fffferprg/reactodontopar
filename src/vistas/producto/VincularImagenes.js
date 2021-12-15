import React, { Component } from 'react'
import FiregramApp from '../../comps/FiregramApp';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import firebase, {db} from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import PopupClientes from '../clientes/PopupClientes';


class VincularImagenes extends Component {
    state={
        moviClienteCodigo:'',
        moviNumeroFao:'',
        listaClientes: [],
        filtroClienteNombre:'',
        filtroClienteCodigo:'',
    }
//////////////////////////////////componentDidMount /////////////////
componentDidMount(){
    this.obtenerClientes()
}
///////////////////////// MODAL CLIENTES ///////////////////////////
        openClienteModal=()=>{
            this.setState({
                showClienteModal: true,
                filtroClienteNombre:'',
                filtroClienteCodigo:'',
            })
            }
        
        closeClienteModal=()=>{
                this.setState({
                showClienteModal: false
                }) 
            }
    
obtenerClientes =()=>{
    let listaClientesTemporal = []
    db.collection('clientes').get()
    .then((clientes)=>{clientes.forEach((cliente)=>{listaClientesTemporal.push({
                id : cliente.id,
                ...cliente.data()      
            })
        })
        this.setState({
            listaClientes : listaClientesTemporal
        })
    })
    .catch((error)=>{
        alert(error)
    })
}

renderListaClientes = () => {
    return this.state.listaClientes
    .filter((documento)=>{
        return (documento.clienteNombre.toLowerCase().indexOf(this.state.filtroClienteNombre.toLowerCase())>=0)
        && (documento.clienteCodigo.toString().indexOf(this.state.filtroClienteCodigo)>=0)
    }) 
    .map((documento) => {
        return (
            // key es un identificador unico
            <tr key={documento.id}> 
                <td>{documento.clienteNombre}</td>
                <td>{documento.clienteCodigo}</td>
                <td><a href="#" onClick={()=>{
                    this.setState({
                        clienteSeleccionado:documento, 
                        moviClienteCodigo:documento.clienteCodigo, 
                        moviClienteNombre:documento.clienteNombre, 
                        moviClienteCarnetEmpleado:documento.clienteCarnetEmpleado,
                        moviClienteEmpleadoNombre:documento.clienteEmpleadoNombre, 
                        moviClienteTelefono:documento.clienteTelefono, 
                        moviClienteFechaNacimiento:documento.clienteFechaNacimiento,
                        textoCarnet:'Carnet: ',
                        textoFechaNacimiento:'FecNac: ',
                        showClienteModal: false 
                    },
                    )}}>
                    SELECCIONAR
                    </a>
                </td>
            </tr>
        )
    })
}
///////////////////////// MANEJAR IMAGENES TEMPORALES ///////////////////////////
manejarImagenes =()=>{
    db.collection('imagenestemporales').get()
    .then((datos)=>{datos.forEach((dato)=>{
            // if(this.state.moviNumeroFao!=''){
                db.collection('imagenesfinales').add({
                    id : dato.id,
                    ...dato.data(), 
                    imagenNumeroFao : this.state.moviNumeroFao,
                })
                .then(()=>{
                    toast.success('Imagenes vinculadas correctamente', {
                        position: "bottom-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                })
            // }
        })
    })
    .catch((error)=>{
        alert(error)
    })
    this.borrarImagenesTemporales()
}
/////////////////////// BORRAR IMAGENESTEMPORALES ////////////////
borrarImagenesTemporales=()=>{
    db.collection('imagenestemporales').get()
    .then((datos)=>{datos.forEach((dato)=>{
                db.collection('imagenestemporales').doc(dato.id).delete()
        })
    })
}
////////////////////////CAPTURAR TECLA ///////////////////////
capturarTecla=(evento)=>{
    this.setState({[evento.target.name]:evento.target.value})
}


    render() {
        return (
            <div>
                <Form>
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={8} sm = {12} xs = {12} ><h4>VINCULAR IMAGENES A PACIENTE</h4></Col>
                         <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                {/* <Form.Label style={{fontSize:"14px"}}>Expediente *</Form.Label> */}
                                <Form.Control type="number" size="sm"  name="moviClienteCodigo" placeholder="Expediente" value = {this.state.moviClienteCodigo} onChange={this.capturarTecla} onClick={this.openClienteModal} />
                            </Form.Group>                        
                        </Col>
                         <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                {/* <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label> */}
                                <Form.Control type="number" size="sm" name="moviNumeroFao" placeholder="Nro.Fao" value={this.state.moviNumeroFao} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                        <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.manejarImagenes()}}>Vincular</Button></Col>{' '}{' '}{' '}
                        <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.borrarImagenesTemporales()}}>Borrar</Button></Col>{' '}{' '}{' '}
                    </Row>
                    <Row >
                        <Col md={12} sm = {12} xs = {12}>
                            <FiregramApp/>
                            <PopupClientes
                                    propsShowClienteModal={this.state.showClienteModal} 
                                    funcionCloseClienteModal={this.closeClienteModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    // funcionGuardar={this.guardar}
                                    // funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    funcionRenderListaClientes={this.renderListaClientes}
                                    // funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>

                        </Col>
                    </Row>
                    <ToastContainer />  
                </Form>
            </div>
        )
    }
}


export default  withRouter(VincularImagenes)