import React, { Component } from 'react'
import {db} from '../../config/admorganizacion';
import { Row, Col, Form, Button, Table , Badge } from 'react-bootstrap';


export default class UsuarioRoles extends Component {
    state = {
        listaRoles : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        rolesUsuarios : [], //LISTA QUE SE VA A ENVIAR A DB 
        emailUsuario : ''
    }
    componentDidMount(){
        this.obtenerRoles()
        this.obtenerRolesUsuarios()
        this.obtenerNombreUsuario()
    }

    obtenerNombreUsuario =()=>{
        db.collection("usuarios").doc(this.props.match.params.usuarioId).get()
        .then (usuario =>{
                // console.log(usuario.data())
            this.setState({emailUsuario : usuario.data().email})
        })


    }
    obtenerRoles=()=>{   // es para crear los checkbox
        let listaTemporal = []
       db.collection('roles').get()
       .then ((snap)=>{
        snap.forEach(documento =>{
            listaTemporal.push({
                id : documento.id,
                ...documento.data()
            })
        })
        this.setState({
            listaRoles : listaTemporal
        })
       })  
    }
    obtenerRolesUsuarios=()=>{   // estos son los roles que tiene el usuario seleccionado
        let usuarioId = this.props.match.params.usuarioId
       db.collection('usuarios').doc(usuarioId).get()
       .then ((usuario)=>{
           console.log(usuario.data().roles)
           if (usuario.data().roles != undefined){
            this.setState({
                rolesUsuarios : usuario.data().roles
            })
           }
        
       })  
    }
    manejarCheckBox=(evento)=>{
        // console.log(evento.target.name)
        // console.log(evento.target.checked)	
        // ESTO ES PARA AGREGAR ROLES
        if (evento.target.checked){  // aqui se marco el checkbox
           let existe = this.state.rolesUsuarios.includes(`${evento.target.name}`);
            if(!existe){
                let nombreRol = evento.target.name
                this.setState({
                    rolesUsuarios : [...this.state.rolesUsuarios, nombreRol]
                })
            }
        }
        // ESTO ES PARA REMOVER ROLES
        if (!evento.target.checked){  // aqui se desmarco el checkbox
            let existe = this.state.rolesUsuarios.includes(`${evento.target.name}`);
            if(existe){
                let nombreRol = evento.target.name
                let rolesFiltrados = this.state.rolesUsuarios.filter((rolActual)=>{
                    return rolActual != nombreRol
                })
                this.setState({
                    rolesUsuarios : rolesFiltrados
                })
            }
        }
    }
    verRoles=()=>{
        console.log(this.state.rolesUsuarios)
    }
    guardarRoles=()=>{
        let usuarioId = this.props.match.params.usuarioId
        db.collection('usuarios').doc(usuarioId).update({roles : this.state.rolesUsuarios})
        .then(()=>{
            alert ('Roles actualizados')
        })
        .catch((error)=>{
            alert(error)
        })
    }
    renderRoles=()=>{
        return this.state.listaRoles.map((rol) => {
            let marcar = this.state.rolesUsuarios.includes(`${rol.nombreRol}`);
            return (
                <Form.Group key={rol.id} >
                    <Form.Check type="checkbox" label={`${rol.nombreRol}`} name={`${rol.nombreRol}`}  onChange={this.manejarCheckBox} checked = {marcar} />
                </Form.Group> 
            )
        })
    }
    render() {
        return (
            <div style={{margin: "40px"}}>
                <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                     <Col><div><h4>{this.state.emailUsuario}</h4></div></Col>
                   
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={4}>
                        <Form>
                            { this.renderRoles()}
                            
                        </Form>
                        <Button variant="primary" size="sm" onClick={this.guardarRoles}>Guardar</Button> {' '}
                        {/* <Button variant="info" size="sm"onClick={this.verRoles}>Ver Roles</Button> {' '} */}
                        <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
