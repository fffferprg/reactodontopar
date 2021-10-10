import React, { Component } from 'react';
import { Row, Col, Form, Button, Table , Badge, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; 
import { ToastContainer, toast } from 'react-toastify';
import Informe from '../../componentes/Informe';
import {MODULES_BECAME_STANDARD_YEAR, imprimirAviso } from './productos';  
import { MdDeleteForever, MdCreate, MdFindInPage} from "react-icons/md";
import NumberFormat from 'react-number-format';
import FiregramApp from '../../comps/FiregramApp';



                    //  *************************STATES*********************

class PopupProductos extends Component {
   componentDidMount (){
    //    console.log(this.props.listaProductos)
   }

    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})

    }

       
        // console.log (datosMovimmientos)
    

                    // RENDERIZADO **************************************************************************
    render() {
        return (
                <Modal  show={this.props.propsShowImagenesModal} onHide={this.props.funcionCloseImagenesModal} >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title>SUBIR IMAGENES</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FiregramApp/>

                        </Modal.Body>
                        <Modal.Footer>
                           
                        </Modal.Footer>
                </Modal>
        )
    }
}

export default withRouter(PopupProductos)