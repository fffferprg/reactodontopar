// componente formulario para subir imagenes

import React, { Component } from 'react'
import {uploadFile} from '../../MyLib/uploadFile';


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
        uploadFile('Productos', image, this.handleProgress, this.handleComplete);
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
                <progress style={{marginBottom: 10}} value={this.state.progress} max="100"/><br/>
                <input type="file" onChange={this.handleChange}/><br/>
                <button onClick={this.handleUpload}>Upload</button><br/>
                <img src={this.state.url} alt="Uploaded images" height="600" width="800"/>
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