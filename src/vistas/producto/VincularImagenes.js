import React, { Component } from 'react'
import FiregramApp from '../../comps/FiregramApp';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import firebase, {db} from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';


class VincularImagenes extends Component {
    state={
        moviNumeroFao:'',
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
                         <Col md={8} sm = {12} xs = {12} ><h4>VINCULAR IMAGENES A FAO</h4></Col>
                         <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                {/* <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label> */}
                                <Form.Control type="number" size="sm" name="moviNumeroFao" placeholder="Nro.Fao" value={this.state.moviNumeroFao} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                        <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.manejarImagenes()}}>Guardar</Button></Col>{' '}{' '}{' '}
                        <Col><Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.borrarImagenesTemporales()}}>Borrar</Button></Col>{' '}{' '}{' '}
                    </Row>
                    <Row >
                        <Col md={12} sm = {12} xs = {12}>
                            <FiregramApp/>
                        </Col>
                    </Row>
                    <ToastContainer />  
                </Form>
            </div>
        )
    }
}


export default  withRouter(VincularImagenes)