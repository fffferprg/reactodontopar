// componente formulario para subir imagenes

import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {uploadFile} from '../../MyLib/uploadFile';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';



export default class UploadFile extends Component {
    state ={
        image: null,
        url: 'http://via.placeholder.com/800x600',
        progress: 0,
        imagenSubida:''
    }
    handleChange = (event) =>{
        this.setState({url: 'http://via.placeholder.com/800x600'})
        this.setState({progress: 0})
        this.setState({imagenSubida: ''})
        if(event.target.files[0]) {
            const imagen = event.target.files[0];
            this.setState({image: imagen});
            console.log('IMAGE',this.state.image)
            // this.handleUpload()
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
        this.setState({imagenSubida: 'Imagen subida'});
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
                            <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={this.handleUpload}>Subir archivo</Button>{' '}<br/>
                        </Col>
                    </Row>
                    <Row>
                    {/* <img src={this.state.url} alt="Uploaded images" height="600" width="800"/> */}
                        <Col md={12} sm = {12} xs = {12}>
                            <progress value={this.state.progress} max="100"/>
                            <h4>{this.state.imagenSubida}</h4><br/>
                        </Col>
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