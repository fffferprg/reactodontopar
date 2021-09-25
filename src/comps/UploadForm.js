import React, { useState } from 'react';
import ProgressBar from '../comps/ProgressBar';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { MdAddCircle} from "react-icons/md";


const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

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
  };

  return (

    <form>
      <Row>
        <Col md={2} sm = {12} xs = {12}>
          <Form.Group>
              {/* <Form.Label style={{fontSize:"14px"}}>Periodo *</Form.Label> */}
              <Form.Control type="text" size="sm"  name="moviPeriodo" placeholder="Periodo" />
          </Form.Group> 
        </Col>
        {/* value = {this.state.moviPeriodo} onChange={this.capturarTecla} onClick={this.openPeriodoModal}               */}
            {/* <input type="text"  /> */}
            <Col md={2} sm = {12} xs = {12}>
                <Form.Group>
                    {/* <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label> */}
                    <Form.Control type="number" size="sm" name="moviNumeroFao" placeholder="Nro.FAO." />
                    {/* value={this.state.moviNumeroFao} onChange={this.capturarTecla} */}
                </Form.Group>
            </Col>
            <Col md={2} sm = {12} xs = {12}>
                <Form.Group>
                    {/* <Form.Label style={{fontSize:"14px"}}>Expediente *</Form.Label> */}
                    <Form.Control type="number" size="sm"  name="moviClienteCodigo" placeholder="Expediente" />
                    {/* value = {this.state.moviClienteCodigo} onChange={this.capturarTecla} onClick={this.openClienteModal} */}
                </Form.Group>                        
            </Col>
            <Col md={2} sm = {12} xs = {12}>
                <Form.Group>
                    {/* <Form.Label style={{fontSize:"14px"}}>Valor Total *</Form.Label> */}
                    <Form.Control type="number" size="sm"  name="valorTotal" placeholder="Valor Total" />
                    {/* value = {this.state.moviClienteCodigo} onChange={this.capturarTecla} onClick={this.openClienteModal} */}
                </Form.Group>                        
            </Col>
      </Row>

      <label>
        <input type="file" onChange={handleChange} />
          <h4>Cargar Imágenes</h4>
          <MdAddCircle color="#3b5998" size="44" />
      </label>
      <div className="output">
        { error && <div className="error">{ error }</div>}
        { file && <div>{ file.name }</div> }
        { file && <ProgressBar file={file} setFile={setFile} /> }
      </div>

    </form>
  );
}

export default UploadForm;