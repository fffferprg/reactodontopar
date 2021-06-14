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

class PopupDetalle extends Component {
   componentDidMount (){
   }

    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})

    }

       
    

                    // RENDERIZADO **************************************************************************
    render() {
        console.log('PROPS',this.props.atributos.detalleMoviNumeroFao, this.props.atributos.detalleMoviClienteNombre)
        const formatoFinal = new Intl.NumberFormat('de-DE')

        return (
                <Modal scrollable size = "lg" show={this.props.propsShowDetalleModal} onHide={this.props.funcionCloseDetalleModal} >
                        <Modal.Header style={{ backgroundColor:"#dbdbdb", color:"#000"}} closeButton>
                            <Modal.Title style={{textAlign:"right"}}>Detalle Fao {'  '}{this.props.atributos.detalleMoviNumeroFao}{'    '}{this.props.atributos.detalleMoviClienteNombre}{'     '}{this.props.atributos.detalleMoviFechaFundacion}</Modal.Title>
                        </Modal.Header>
                            {/* <Form>
                                <Row>
                                    <Col md={1}></Col>
                                    <Col md={4}>  
                                        <Form.Group>
                                                <Form.Label>Paciente</Form.Label>
                                                <Form.Control type="text"  size="sm"  name="detalleMoviClienteNombre" value = {this.props.atributos.detalleMoviClienteNombre} onChange={this.props.funcionCapturarTecla} disabled />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                                <Form.Label>Nro. FAO</Form.Label>
                                                <Form.Control type="text"  size="sm"  name="detalleMoviNumeroFao" value = {this.props.atributos.detalleMoviNumeroFao} onChange={this.props.funcionCapturarTecla} disabled />
                                            
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form> */}
                        <Modal.Body >
                            <Row>
                                <Col>
                                    <Table responsive striped bordered hover size="sm" >
                                        <thead >
                                            <th style={{position : "sticky", textAlign:"center"}}>Codigo</th>
                                            <th style={{position : "sticky", textAlign:"center"}}>Procedimiento</th>
                                            <th style={{position : "sticky", textAlign:"center"}}>Descripcion</th>
                                            <th style={{position : "sticky", textAlign:"center"}}>Valor</th>
                                        </thead>
                                        <tbody >
                                        {/* {this.props.funcionLimpiarCamposAbajo()} */}
                                           {this.props.funcionRenderDetalle()}
                                           <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{fontWeight: "bold",textAlign:"right"}}>TOTAL</td>
                                                    <td style={{fontWeight: "bold",textAlign:"right"}}>{formatoFinal.format(this.props.atributos.detalleSumatoriaBrutoFinal)}</td>
                                                    {/* <td style={{fontWeight: "bold",textAlign:"center"}}>{this.state.neto}{formatoFinal.format(this.state.sumatoriaNetoFinal)}</td> */}
                                                </tr>       

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

export default withRouter(PopupDetalle)