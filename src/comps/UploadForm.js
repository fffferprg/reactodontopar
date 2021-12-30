import React, { useState, Component } from 'react';
import ProgressBar from '../comps/ProgressBar';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { MdAddCircle} from "react-icons/md";


const UploadForm = () => {

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const types = ['image/png', 'image/jpeg'];

  // console.log('CLIENTE NOMBRE:',clienteNombre);

  const handleChange = (e) => {
    let selected = e.target.files[0]; // coloca en selected el archivo seleccionado
  
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Seleccione una imagen (png o jpg)');
    }
  };
 

  return (

    <form>
      <label>
        <input type="file" onChange={handleChange} />
          <h6>Cargar Imagenes</h6>
          <MdAddCircle color="#3b5998" size="44" />
      </label>
      <div className="output">
        { error && <div className="error">{ error }</div>}
        { file && <div>{ file.name }</div> }
        
        {/* llama al programa para cargar la imagen */}
        { file && <ProgressBar file={file} setFile={setFile} /> } 
      </div>

    </form>
  );
}

export default UploadForm;