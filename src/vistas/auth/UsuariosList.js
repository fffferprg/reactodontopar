import React, { Component } from 'react';
import { Row, Col, Button, Table, Badge } from 'react-bootstrap';
// import {db} from '../../config/firebase';
import {auth, db} from '../../config/admorganizacion';
import {Link} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import { MdCached, MdCreate } from "react-icons/md";


class UsuariosList extends Component {
    state={
        listaUsuarios : [ ],
        empresaLogeado : ''
    }

    volver=()=>{
        this.props.history.goBack()
    }
    componentDidMount(){
        this.authListener()
        this.obtenerDatos()
    }
    confirmarAccion = (productoId) => {
        confirmAlert({
          title: 'Accion borrar',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.borrarProducto(productoId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      }

      authListener = () => {
        auth.onAuthStateChanged((user) => {
          if(user) {
            let emailUsuario = user.email
            console.log('Email usuario: ', user.email)
            console.log('Nombre usuario: ', user.displayName)
            console.log('Id usuario: ', user.uid)
            db.collection('usuarios').doc(user.uid).get()
            .then((user)=>{
                console.log(user.data().estado)
                if(user.data().estado == 0){    
                    auth.signOut()
                    alert('Usuario no habilitado')
                }else{
                    this.setState({
                        empresaLogeado: user.data().empresa,
                     })
                     console.log('FUCKING LOGEADO:',this.state.empresaLogeado)
                    //  console.log(this.state)
                }
            })
             // User is signed in.
      
          } else {
            console.log('Login incorrecto/logout: ', user)
              // User is signed out.
              this.setState({usuarioLogeado: false})
          }
      
        })
      }

    obtenerDatos=()=>{
        let listaTemporal = []
        db.collection('usuarios').get()
        .then((snap)=>{
            snap.forEach((documento)=>{
                // console.log(documento.data())
                    console.log('EMPRESA COLLECTION:', documento.data().empresa)
                    console.log('EMPRESA USUARIO LOGEADO:', this.state.empresaLogeado)
                // if (this.state.empresaLogeado==documento.data().empresa){
                    listaTemporal.push({
                        id : documento.id,
                        email : documento.data().email,
                        estado : documento.data().estado
                    })
                // }    
            })
            this.setState({
                listaUsuarios : listaTemporal
            })
            // console.log(this.state)
         })
        .catch((error)=>{
            alert(error)
        })
    }
    cambiarEstado=(usuarioId)=>{
        let listaFiltrada = this.state.listaUsuarios.filter((elemento)=>{
                return elemento.id == usuarioId
        })
            console.log(listaFiltrada) 
         let  estadoNuevo = ''   
        if(listaFiltrada[0].estado==1){
            estadoNuevo = 0
        }
        if(listaFiltrada[0].estado==0){
           estadoNuevo = 1 
        }
        db.collection('usuarios').doc(usuarioId).update({estado : estadoNuevo})
        .then(()=>{
            this.obtenerDatos()
            alert('Usuario modificado correctamente')
        })
        .catch((error)=>{
            alert(error)
        })
            
    }
    habilitarUsuario=(usuarioId)=>{
        // this.setState({mostrarFiltro:!this.state.mostrarFiltro})
            {db.collection('usuarios').doc(usuarioId).update({estado : 1})
            .then(()=>{
                this.obtenerDatos()
                alert('Usuario habilitado correctamente')
            })
            .catch((error)=>{
                alert(error)
            })
            }    
    }
    inhabilitarUsuario=(usuarioId)=>{
        // this.setState({mostrarFiltro:!this.state.mostrarFiltro})
            {db.collection('usuarios').doc(usuarioId).update({estado : 0})
            .then(()=>{
                this.obtenerDatos()
                alert('Usuario inhabilitado correctamente')
            })
            .catch((error)=>{
                alert(error)
            })
            }    
    }

    renderItems = ()=> {
        return this.state.listaUsuarios.map((documento)=>{
            return(
                <tr key = {documento.id}> 
                    <td>{documento.email}</td>
                    <td>{documento.estado==1?<Badge pill variant="info"> Activo </Badge>:<Badge pill variant="danger"> Inactivo </Badge>}</td>
                    {/* <td>{documento.estado}</td> */}
                    {/* <td> <p onClick={()=>this.habilitarUsuario(documento.id)}>Editar</p> </td> */}
                    <td> <MdCached size="19" onClick ={()=>this.cambiarEstado(documento.id)} />
                    <Link to = {`/usuario/roles/${documento.id}`}> <MdCreate color="#3b5998" size="24"  /> </Link>
                    </td>

                </tr>
            )
        })
    }
    render() {
        return (    
            <div>
               {/* <Row style={{marginTop:"10px"}}> 
                   <Col><h2>Usuarios</h2></Col>
               </Row> */}
                <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000", paddingTop:5}}> 
                    <Col md = {5}></Col>
                        <Col><h4>USUARIOS</h4></Col>
                    <Col md = {4}></Col>

                </Row>
                <Row>
                   <Col>
                        <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            {/* <th>Código</th> */}
                                            <th>Email</th>
                                            <th>Estado</th>
                                             <th>Acciones</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderItems()}
                                       
                                    </tbody>
                                </Table>
                        </Col>
               </Row>
               <Row>
                   <Col>
                        <Button variant="danger" onClick={this.volver} >Volver</Button>
                   </Col>
               </Row>
            </div>

        )
                
            
        
    }
}


export default UsuariosList;