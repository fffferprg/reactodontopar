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

class PopupTercerosMolares extends Component {





                    // RENDERIZADO **************************************************************************
    render() {
        // console.log('LISTA ZONAS:',this.state.listaZonas)
        // console.log('ZONAS SELECCIONADAS:',this.state.dientesZonas)
        // console.log('DIENTES SELECCIONADOS:',this.state.dientesZonas)
    

        return (
                <Modal  show={this.props.propsShowTercerosModal} onHide={this.props.funcionCloseTercerosModal}  >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title>TERCEROS MOLARES</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                            {/* <Col><div><h4>{this.state.emailUsuario}</h4></div></Col> */}
                   
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md={10}>
                                <Form>
                                    { this.props.funcionRenderTercerosMolares()}
                                </Form>
                                {/* <Button variant="primary" size="sm" onClick={this.guardarRoles}>Guardar</Button> {' '} */}
                                {/* <Button variant="info" size="sm"onClick={this.verRoles}>Ver Roles</Button> {' '} */}
                                <Button variant = "info" size="sm" onClick={this.props.funcionCloseTercerosModal}>Confirmar</Button>
                            </Col>
                </Row>

                        </Modal.Body>
                        <Modal.Footer>
                           
                        </Modal.Footer>
                </Modal>
        )
    }
}

export default withRouter(PopupTercerosMolares)