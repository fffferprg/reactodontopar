import React, { Component } from 'react';
import { Row, Col, Form, Button, Table , Badge, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; 
import { ToastContainer, toast } from 'react-toastify';
import Informe from '../../componentes/Informe';
// import {MODULES_BECAME_STANDARD_YEAR, imprimirAviso } from './productos';  
import { MdDeleteForever, MdCreate, MdFindInPage} from "react-icons/md";
import NumberFormat from 'react-number-format';



                    //  *************************STATES*********************

class PopupZonas extends Component {

    state = {
        listaZonas : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        dientesZonas : [], //LISTA QUE SE VA A ENVIAR A DB 
        emailUsuario : ''
    }
   componentDidMount (){
        this.obtenerZonas()
   }
   obtenerZonas=()=>{   // es para crear los checkbox
    let listaTemporal = []
   db.collection('dienteszonas').orderBy('zonaNumero').get()
   .then ((snap)=>{
    snap.forEach(documento =>{
        listaTemporal.push({
            id : documento.id,
            ...documento.data()
        })
    })
    this.setState({
        listaZonas : listaTemporal,
    })
   })  
}
renderZonas=()=>{
    return this.state.listaZonas.map((zona) => {
        let marcar = this.state.dientesZonas.includes(`${zona.zonaNombre}`);
        return (
            <Form.Group key={zona.id} >
                <Form.Check type="checkbox" label={`${zona.zonaNombre}`} name={`${zona.zonaNombre}`}  onChange={this.manejarCheckBox} checked = {marcar} />
            </Form.Group> 
        )
    })
}
   manejarCheckBox=(evento)=>{
        // console.log(evento.target.name)
        // console.log(evento.target.checked)	
        // ESTO ES PARA AGREGAR ROLES
        if (evento.target.checked){  // aqui se marco el checkbox
            let existe = this.state.dientesZonas.includes(`${evento.target.name}`);
             if(!existe){
                 let nombreZona = evento.target.name
                 this.setState({
                    dientesZonas : [...this.state.dientesZonas, nombreZona]
                 })
                 this.props.atributos.zonasSeleccionadas = [...this.state.dientesZonas, nombreZona]
             }
         }
         // ESTO ES PARA REMOVER ROLES
         if (!evento.target.checked){  // aqui se desmarco el checkbox
             let existe = this.state.dientesZonas.includes(`${evento.target.name}`);
             if(existe){
                 let nombreZona = evento.target.name
                 let zonasFiltradas = this.state.dientesZonas.filter((zonaActual)=>{
                     return zonaActual != nombreZona
                 })
                 this.setState({
                    dientesZonas : zonasFiltradas
                 })
                 this.props.atributos.zonasSeleccionadas = zonasFiltradas
             }
         }
         
     }

                    // RENDERIZADO **************************************************************************
    render() {
        // console.log('LISTA ZONAS:',this.state.listaZonas)
        // console.log('ZONAS SELECCIONADAS:',this.state.dientesZonas)
        console.log('DIENTES SELECCIONADOS:',this.state.dientesZonas)
    

        return (
                <Modal  show={this.props.propsShowZonaModal} onHide={this.props.funcionCloseZonaModal}  >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title>ZONAS</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                            {/* <Col><div><h4>{this.state.emailUsuario}</h4></div></Col> */}
                   
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md={6}>
                                <Form>
                                    { this.renderZonas()}
                                </Form>
                                {/* <Button variant="primary" size="sm" onClick={this.guardarRoles}>Guardar</Button> {' '} */}
                                {/* <Button variant="info" size="sm"onClick={this.verRoles}>Ver Roles</Button> {' '} */}
                                <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                            </Col>
                </Row>

                        </Modal.Body>
                        <Modal.Footer>
                           
                        </Modal.Footer>
                </Modal>
        )
    }
}

export default withRouter(PopupZonas)