// componente formulario para subir imagenes

import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {uploadFile} from '../../MyLib/uploadFile';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';



export default class UploadFile extends Component {
    state ={
        image: null,
        url: 'http://via.placeholder.com/800x600',
        progress: 0
    }
    handleChange = (event) =>{
        if(event.target.files[0]) {
            const image = event.target.files[0];
            this.setState({image: image});
        }
    }
    handleUpload = () => {
        // const  { image } = this.state;
        const image = this.state.image
        uploadFile('FAOS', image, this.handleProgress, this.handleComplete);
    }
    handleProgress = (progress) => {
        this.setState({progress: progress});
    }
    handleComplete = (url) => {
        this.setState({url: url});
    }
    render() {
        return (
            <div>
                <Form>
                    <Row>
                        <Col md={5} sm = {12} xs = {12}>
                            {/* <Form.Group>
                                <Form.Label>Imagen</Form.Label>
                                <Form.Control type="file"  size="sm" name="codigo" value = {this.state.codigo} onChange={this.handleChange} />
                                <Form.Control type="file"  size="sm" onChange={this.handleChange} />
                            </Form.Group> */}
                            <input type="file" onChange={this.handleChange}/><br/><br/>
                            {/* <input type="file" style={{color: 'transparent'}} onChange={this.handleChange}/> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={this.handleUpload}>Subir archivo</Button>{' '}
                        </Col>
                        <Col md={2} sm = {12} xs = {12}>
                            <progress value={this.state.progress} max="100"/><br/>
                        </Col>
                    </Row>
                    <Row>
                    {/* <img src={this.state.url} alt="Uploaded images" height="600" width="800"/> */}
                    <img src={this.state.url} alt="Uploaded images" class="img-fluid" />
                    </Row>
                </Form>
            </div>
        )
    }
}

const style = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}