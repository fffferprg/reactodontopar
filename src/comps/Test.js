import React, { Component, useState } from 'react'
// import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
// import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { MdAddCircle} from "react-icons/md";
import { Link, NavLink, withRouter } from 'react-router-dom';

class Test extends Component {
    // componentDidMount(){
    //     this.UploadForm()
    // }    
    // UploadForm = () => {
    //     var [file, setFile] = useState(null);
    //     var [error, setError] = useState(null);

    //     const types = ['image/png', 'image/jpeg'];
      
    // }
    HandleChange = () => {
        var [file, setFile] = useState(null);
        var [error, setError] = useState(null);

        const types = ['image/png', 'image/jpeg'];

        const handleChange = (e) => {
            let selected = e.target.files[0];

            if (selected && types.includes(selected.type)) {
            setFile(selected);
            setError('');
            } else {
            setFile(null);
            setError('Seleccione una imagen (png o jpg)');
            }
        }
    }
    render() {
        return (
            <form>
                <label>
                    <input type="file" onChange={this.HandleChange} />
                    <h4>Imágenes</h4>
                    <MdAddCircle color="#3b5998" size="44" />
                </label>
                {/* <div className="output">
                    { error && <div className="error">{ error }</div>}
                    { file && <div>{ file.name }</div> }
                    { file && <ProgressBar file={file} setFile={setFile} /> }
                </div> */}
            </form>
        )
    }
}
export default  withRouter(Test)