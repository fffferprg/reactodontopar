import React, { Component } from 'react'
import FiregramApp from '../../comps/FiregramApp';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import firebase, {db} from '../../config/firebase';

class VincularImagenes extends Component {
    state={
        moviNumeroFao:'',
    }

    render() {
        return (
            <div>
                <Form>
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>VINCULAR IMAGENES A FAO</h4></Col>
                    </Row>
                    <Row >
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label>
                                <Form.Control type="number" size="sm" name="moviNumeroFao" value={this.state.moviNumeroFao} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>
                        <Col md={12} sm = {12} xs = {12}>
                            <FiregramApp/>
                        </Col>
                    </Row>
                </Form>
                {/* <FiregramApp/> */}
                <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}{' '}{' '}
            </div>
        )
    }
}

///////////////////////// MANEJAR IMAGENES TEMPORALES ///////////////////////////
// manejarImagenes =()=>{
//     let listaImagenesTemporal = []
//     db.collection('imagenestemporales').get()
//     .then((imagenes)=>{imagenes.forEach((imagen)=>{
//             listaImagenesTemporal.push({
//                 id : imagen.id,
//                 ...imagen.data()      
//             })
//         })
//         this.setState({
//             listaImagenesProvisorias : listaImagenesTemporal
//         })
//     })
//     .catch((error)=>{
//         alert(error)
//     })
//     db.collection('imagenestemporales').get()
//     .then((datos)=>{datos.forEach((dato)=>{
//             // if(this.state.moviNumeroFao!=''){
//                 db.collection('imagenesfinales').add({
//                     id : dato.id,
//                     ...dato.data(), 
//                     imagenNumeroFao : this.state.moviNumeroFao,
//                     imagenClienteCodigo : this.state.moviClienteCodigo,
//                 })
//             // }
//         })
//     })
//     .catch((error)=>{
//         alert(error)
//     })
// }
export default  withRouter(VincularImagenes)