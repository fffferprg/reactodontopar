import React, { Component } from 'react'
import FiregramApp from '../../comps/FiregramApp';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import firebase, {db} from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import PopupClientes from '../clientes/PopupClientes';
import NumberFormat from 'react-number-format';



class VincularImagenes extends Component {
    state={
        moviClienteCodigo:'',
        moviNumeroFao:'',
        listaClientes: [],
        filtroClienteNombre:'',
        filtroClienteCodigo:'',
        moviTotalFaoBruto:'',
        moviClienteNombre:'',
        textoG$:'G$: ',
        notificacion1: '',
        notificacion2: '',
        notificacion3: '',
        comentario1:'',
        comentario2:'',
        comentario3:'',
    }
//////////////////////////////////componentDidMount /////////////////
componentDidMount(){
    this.obtenerClientes()
}
//////////////////////////////////componentDidMount /////////////////
componentWillUnmount(){
    this.borrarImagenesTemporales()
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
///////////////////////// MANEJAR IMAGENES  ///////////////////////////
manejarImagenes =()=>{
    if(this.state.moviNumeroFao
        && this.state.moviClienteCodigo
        && this.state.moviTotalFaoBruto
        && this.state.notificacion1
        && this.state.comentario1){
            db.collection('imagenestemporales').get().then((datos)=>{datos.forEach((dato)=>{
                if(dato[0]){
                        db.collection('imagenesfinales').add({
                            id : dato.id,
                            ...dato.data(), 
                            imagenNumeroFao : this.state.moviNumeroFao,
                            imagenClienteCodigo : this.state.moviClienteCodigo,
                            imagenClienteNombre : this.state.moviClienteNombre,
                            imagenTotalFaoBruto : this.state.moviTotalFaoBruto,
                            imagenNotificacion1: this.state.notificacion1,
                            imagenComentario1: this.state.comentario1,
                            imagenNotificacion2: this.state.notificacion2,
                            imagenComentario2: this.state.comentario2,
                            imagenNotificacion3: this.state.notificacion3,
                            imagenComentario3: this.state.comentario3,
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
                                this.limpiarCampos()
                        })
                }else{alert('Debe cargar al menos una imagen')}
            })
            })
            .catch((error)=>{
                alert(error)
            })
            this.borrarImagenesTemporales()
    }else{
        alert('Los campos con * son obligatorios')  

    }
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
////////////////////////CAPTURAR VALOR ///////////////////////

capturarValorFormato=(evento, name)=>{
    this.setState({[name]:evento.floatValue})
}

/////////////////////////////////LIMPIAR CAMPOS
limpiarCampos=()=>{
    this.setState ({
        moviClienteCodigo:'',
        moviNumeroFao:'',
        filtroClienteNombre:'',
        filtroClienteCodigo:'',
        moviTotalFaoBruto:'',
        moviClienteNombre:'',
        vencimiento1: '',
        vencimiento2: '',
        vencimiento3: '',
        comentario1:'',
        comentario2:'',
        comentario3:'',

    })
}
/////////////////////////////////////////    RENDER
    render() {
        const formatoFinal = new Intl.NumberFormat('de-DE')
        return (
            <div>
                <Form>
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={4} sm = {12} xs = {12} ><h4>VINCULAR IMAGENES</h4></Col>
                         {/* <Col md={2} sm = {6} xs = {6} style={{paddingTop:5}}><h5>{this.state.textoG$}{formatoFinal.format(this.state.moviTotalFaoBruto)}</h5></Col> */}
                        {/* <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.borrarImagenesTemporales()}}>Borrar</Button></Col>{' '}{' '}{' '} */}
                    </Row>
                    <Row >
                        <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Paciente *</Form.Label>
                                <Form.Control type="number" size="sm"  name="moviClienteCodigo" value = {this.state.moviClienteCodigo} onChange={this.capturarTecla} onClick={this.openClienteModal} />
                            </Form.Group>                        
                        </Col>
                        <Col md={4} sm = {6} xs = {6} style = {{paddingTop:25}} >{this.state.moviClienteNombre} </Col>   

                        {/* <Col md={2} sm = {6} xs = {6}>
                            <div>
                                <img style={{width:"20", heigh:"20"}}
                                    src={`https://firebasestorage.googleapis.com/v0/b/devodontopar.appspot.com/o/WhatsApp%20Image%202020-12-28%20at%2010.12.40.jpeg?alt=media&token=fcbf4a53-c6d9-41e8-b73a-986013a05f20`}
                                />
                            </div>
                        </Col> */}
                    </Row>
                    <Row style = {{textAlign : "right"}}>
                        <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label>
                                <Form.Control type="number" size="sm" name="moviNumeroFao"  value={this.state.moviNumeroFao} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                        <Col md={2} sm = {6} xs = {6} >
                            <Form.Group>
                                        <Form.Label>Total FAO G$ *</Form.Label>
                                        <NumberFormat style = {{borderColor:'#f3f3f3', backgroundColor:'#fff', width:'150px', borderRadius:"4px"}} 
                                        value={this.state.moviTotalFaoBruto} onValueChange ={(evento)=>{this.capturarValorFormato(evento, "moviTotalFaoBruto" )}} thousandSeparator ={true} />
                            </Form.Group>
                        </Col>             
                    </Row>
                    <Row>
                        <Col>
                            <FiregramApp/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>1ra Notificacion *</Form.Label>
                                <Form.Control type="number" size="sm"  name="notificacion1" placeholder="En meses" value = {this.state.notificacion1} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={6} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Comentario *</Form.Label>
                                <Form.Control type="text" size="sm"  name="comentario1" value = {this.state.comentario1} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>2da Notificacion</Form.Label>
                                <Form.Control type="number" size="sm"  name="notificacion2" placeholder="En meses" value = {this.state.notificacion2} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={6} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Comentario</Form.Label>
                                <Form.Control type="text" size="sm"  name="comentario2" value = {this.state.comentario2} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>3ra Notificacion</Form.Label>
                                <Form.Control type="number" size="sm"  name="notificacion3" placeholder="En meses" value = {this.state.notificacion3} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                        <Col md={6} sm = {6} xs = {6}>
                        <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Comentario</Form.Label>
                                <Form.Control type="text" size="sm"  name="comentario3" value = {this.state.comentario3} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12} sm = {12} xs = {12}>
                            <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.manejarImagenes()}}>Grabar</Button></Col>{' '}{' '}{' '}
                            <PopupClientes
                                    propsShowClienteModal={this.state.showClienteModal} 
                                    funcionCloseClienteModal={this.closeClienteModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionRenderListaClientes={this.renderListaClientes}
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