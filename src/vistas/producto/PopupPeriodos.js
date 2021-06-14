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



                    //  *************************STATES*********************

class PopupPeriodos extends Component {
   componentDidMount (){
       console.log(this.props.listaPeriodos)
   }

                     // RENDERIZADO **************************************************************************
    render() {
        return (
                <Modal  show={this.props.propsShowPeriodoModal} onHide={this.props.funcionClosePeriodoModal} >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title>PERIODOS</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row>
                                    <Col md={8}>  
                                        <Form.Group>
                                                <Form.Label>AÑO</Form.Label>
                                                <Form.Control type="text"  size="sm"  name="filtroPeriodoAnho" value = {this.props.atributos.filtroPeriodoAnho} onChange={this.props.funcionCapturarTecla} />
                                        </Form.Group>
              
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                                <Form.Label>MES</Form.Label>
                                                <Form.Control type="text"  size="sm"  name="filtroPeriodoMes" value = {this.props.atributos.filtroPeriodoMes} onChange={this.props.funcionCapturarTecla}  />
                                            
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <Row>
                                <Col md={3}></Col>
                                <Col md={3}></Col>
                                <Col md={6}>
                                    {/* <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.props.funcionGuardar()}}>Guardar</Button>{' '}
                                    <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.props.funcionLimpiarCampos}>Limpiar Campos</Button>{' '} */}
                                </Col>
                            </Row>
                            {/* <br/> */}
                            <Row>
                                <Col>
                                    <Table responsive striped bordered hover size="sm">
                                        <thead>
                                        <th style={{textAlign:"center"}}>Año</th>
                                        <th style={{textAlign:"center"}}>Mes</th>
                                        <th style={{textAlign:"center"}}>Accion</th>
                                        </thead>
                                        <tbody>
                                        {/* {this.props.funcionLimpiarCamposAbajo()} */}
                                           {this.props.funcionRenderListaPeriodos()}
                                        </tbody>

                                    </Table>
                                </Col>
                            </Row>    

                        </Modal.Body>
                        <Modal.Footer>
                           
                        </Modal.Footer>
                </Modal>
        )
    }
}

export default withRouter(PopupPeriodos)