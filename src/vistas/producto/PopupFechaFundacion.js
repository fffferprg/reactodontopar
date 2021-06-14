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

class PopupFechaFundacion extends Component {





                    // RENDERIZADO **************************************************************************
    render() {
        return (
                <Modal  show={this.props.propsShowFechaFundacionModal} onHide={this.props.funcionCloseFechaFundacionModal}  >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title>FECHA INICIO DE GARANTIA</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {/* <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}> */}
                        <Row>
                            <Col md={12} sm = {12} xs = {12}>
                                <Form.Group>
                                    {/* <Form.Label style={{fontSize:"14px"}}>Fecha Pericia Final*</Form.Label> */}
                                    <Form.Control type="date" size="sm"  name="moviFechaFundacion" value = {this.props.atributos.moviFechaFundacion} onChange={this.props.funcionCapturarTecla} />
                                </Form.Group>                        
                            </Col>
                        </Row>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant = "info" size="sm" onClick={this.props.funcionGuardar}>Confirmar</Button>
                        </Modal.Footer>
                </Modal>
        )
    }
}

export default withRouter(PopupFechaFundacion)