import React from  'react'
import {Row, Col, Form, Button, Card,} from 'react-bootstrap'
import {Link} from 'react-router-dom'



class Login extends React.Component {
state = {
    email : '',
    password:''
}
capturarTecla=(evento)=>{
    this.setState({[evento.target.name]:evento.target.value})
}
login =() =>{
    // console.log(this.state)
    this.props.logear(this.state.email, this.state.password)
}
registro = () => {
    this.props.history.push('/registro')
}

    render() {
        return(
            <div style={{margin: "40px"}}>
                <Row className="justify-content-md-center">
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Introduzca su email" name="email" value={this.state.email} onChange={this.capturarTecla} />
                                    </Form.Group>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="password"  value={this.state.password } onChange={this.capturarTecla}/>
                                    </Form.Group>
                                </Form>
                                
                                <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} type="submit" onClick={this.login}>
                                    Entrar
                                </Button>
                                <br/>
                                <Link to={'/registro'} >Registrarse</Link>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </div>
        )
    }
}  
export default Login