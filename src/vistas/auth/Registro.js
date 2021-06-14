import React from  'react'
import {Row, Col, Form, Button, Card} from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import {auth, db} from '../../config/admorganizacion'



class Registro extends React.Component {
state = {
    email : '',
    password:'',
    repassword:'',
    ruc:'',
    empresa:'',
}

validarDatos=()=>{
    if(this.state.password!='' && this.state.repassword!='' && this.state.email != ''
    && this.state.empresa!='' && this.state.ruc != ''){
        // console.log(this.state)
        if(this.state.password==this.state.repassword){
          auth.createUserWithEmailAndPassword(this.state.email, this.state.password) 
          .then(()=>{
              const userId = auth.currentUser.uid;
              console.log('ID del usuario actual: ', userId)
              db.collection('usuarios').doc(userId).set({
                  email:this.state.email, 
                  estado : 0,
                  ruc: this.state.ruc,
                  empresa:this.state.empresa,
                })
              alert('Usuario registrado correctamente')
            //   auth.signOut()
          })
          .catch((error)=>{
            alert(error)
          })
        }else {alert('Datos no coinciden.')

        }

    }else {alert('Todos los campos son obligatorios.')
        // toast.danger('Todos los campos son obligatorios.', {
        //     position: "bottom-right",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     })
    }
}
capturarTecla=(evento)=>{
    this.setState({[evento.target.name]:evento.target.value})
}
registro =() =>{
    // console.log(this.state)
    // this.props.logear(this.state.email, this.state.password)
}

    render() {
        return(
            <div style={{margin: "40px"}}>
                <Row className="justify-content-md-center">
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Form>
                                <Form.Group controlId="formEmpresa">
                                        <Form.Label>Empresa</Form.Label>
                                        <Form.Control type="text" placeholder="EMPRESA" name="empresa" value={this.state.empresa} onChange={this.capturarTecla} />
                                    </Form.Group>
                                    <Form.Group controlId="formRuc">
                                        <Form.Label>RUC</Form.Label>
                                        <Form.Control type="text" placeholder="RUC" name="ruc"  value={this.state.ruc} onChange={this.capturarTecla}/>
                                    </Form.Group>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Introduzca su email" name="email" value={this.state.email} onChange={this.capturarTecla} />
                                    </Form.Group>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="password"  value={this.state.password } onChange={this.capturarTecla}/>
                                    </Form.Group>
                                    <Form.Group controlId="formRePassword">
                                        <Form.Label>Repetir Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="repassword"  value={this.state.repassword } onChange={this.capturarTecla}/>
                                    </Form.Group>
                                </Form>
                                
                                <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} type="submit" onClick={this.validarDatos}>
                                    Registrarse
                                </Button>
                                {' '}
                                <Button variant = 'danger' type="submit" onClick={()=>this.props.history.goBack()}>
                                    Volver
                                </Button>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
                <ToastContainer/>
            </div>
        )
    }
}  
export default Registro