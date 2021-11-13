import React, { Component }  from 'react';
import { Container } from 'react-bootstrap';
import Home from './vistas/Home';
import Menu from './vistas/Menu';
// import ProductoList from './vistas/producto/ProductoList';
import ProductoAbm from './vistas/producto/ProductoAbm';
import ProductoCompra from './vistas/producto/ProductoCompra';
import ProductoProduccion from './vistas/producto/ProductoProduccion';
import ProductoVenta from './vistas/producto/ProductoVenta';
import ProductoMovimientos from './vistas/producto/ProductoMovimientos';
import Login from './vistas/auth/Login';
import Registro from './vistas/auth/Registro';
import UsuarioList from './vistas/auth/UsuariosList';
import Roles from './vistas/auth/Roles';  
import UsuarioRoles from './vistas/auth/UsuarioRoles';  
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {auth, db} from './config/admorganizacion'; 
import ProductoConsulta from './vistas/producto/ProductoConsulta';
import UploadFile from './vistas/producto/UploadFile';
import FiregramApp from './comps/FiregramApp'
import ClienteAbm from './vistas/clientes/ClienteAbm';
import ProcedimientosLiberados from './vistas/producto/ProcedimientosLiberados';
import ProcedimientosLiberadosDetalle from './vistas/producto/ProcedimientosLiberadosDetalle';
import ProductoConfirmaFecha from './vistas/producto/ProductoConfirmaFecha';
import ProductoHistorico from './vistas/producto/ProductoHistorico';
import ProductoVentaCopy from './vistas/producto/ProductoVentaCopy';



class App extends Component {
  state={
    usuarioLogeado: false,
    email: '',
    titulo:'',
    rolesUsuarios : [],
    empresa:'',
    ruc:'',
  }
  ///////////////////////
componentDidMount(){
  this.authListener()
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
              usuarioLogeado: true, 
              email : emailUsuario, 
              rolesUsuarios : user.data().roles,
              ruc:user.data().ruc,
              empresa:user.data().empresa,
            })

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

  logear = (email, password) => {
    // console.log('metodo autenticacion')
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      alert(error)
    })
  }
  
  salir =() => {
    auth.signOut();
  }

 render() {
   return(
    //  <ProductoForm/>
     <Router>
        <Container>
         {this.state.usuarioLogeado== true? <Menu 
                                            metodoSalir = {this.salir} 
                                            atributoEmail = {this.state.email} 
                                            rolesUsuarios= {this.state.rolesUsuarios}
                                            ruc= {this.state.ruc}
                                            empresa={this.state.empresa}/> : null}
          <Switch>
              <PrivateRoute exact path="/home" component={Home} usuarioLogeado={this.state.usuarioLogeado}/>
              {this.state.rolesUsuarios.includes('Productos')?<PrivateRoute exact path="/productos" component={ProductoAbm} usuarioLogeado={this.state.usuarioLogeado}/>:null}
              {this.state.rolesUsuarios.includes('Stock')?<PrivateRoute exact path="/productos/stock" component={ProductoConsulta} usuarioLogeado={this.state.usuarioLogeado}/>:null}
              {this.state.rolesUsuarios.includes('Compras')?<PrivateRoute exact path="/productos/compras" component={ProductoCompra} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Ventas')?<PrivateRoute exact path="/productos/ventas" component={ProductoVenta} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {/* {this.state.rolesUsuarios.includes('Ventas')?<PrivateRoute exact path="/productos/ventas" component={ProductoVentaCopy} usuarioLogeado={this.state.usuarioLogeado} />:null} */}
              {this.state.rolesUsuarios.includes('Produccion')?<PrivateRoute exact path="/productos/produccion" component={ProductoProduccion} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Confirmacion')?<PrivateRoute exact path="/productos/confirmacion" component={ProductoConfirmaFecha} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Historico')?<PrivateRoute exact path="/productos/historico" component={ProductoHistorico} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Movimientos')?<PrivateRoute exact path="/productos/movimientos" component={ProcedimientosLiberadosDetalle} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Usuarios')?<PrivateRoute exact path="/usuarios" component={UsuarioList} usuarioLogeado={this.state.usuarioLogeado} />:null}
              {this.state.rolesUsuarios.includes('Roles')?<PrivateRoute exact path="/roles" component={Roles} usuarioLogeado={this.state.usuarioLogeado} />:null}
              <PrivateRoute exact path="/usuario/roles/:usuarioId" component={UsuarioRoles} usuarioLogeado={this.state.usuarioLogeado} />
              {this.state.rolesUsuarios.includes('Clientes')?<PrivateRoute exact path="/clientes" component={ClienteAbm} usuarioLogeado={this.state.usuarioLogeado}/>:null}
              {this.state.rolesUsuarios.includes('Subir imagen')?<PrivateRoute exact path="/subirimagen" component={UploadFile} usuarioLogeado={this.state.usuarioLogeado}/>:null}
              {/* {this.state.rolesUsuarios.includes('Subir imagen')?<PrivateRoute exact path="/subirimagen" component={FiregramApp} usuarioLogeado={this.state.usuarioLogeado}/>:null} */}
              {/* <PrivateRoute exact path="/uploadfile" component={UploadFile} usuarioLogeado={this.state.usuarioLogeado}/> */}
              <PublicRoute  exact path="/" component={Login} usuarioLogeado={this.state.usuarioLogeado} logear= {this.logear}/>
              <PublicRoute  exact path="/registro" component={Registro} usuarioLogeado={this.state.usuarioLogeado}/>
          </Switch>
        </Container>
     </Router>
   )
 }
}

const PrivateRoute = ({component:Component, usuarioLogeado,  ...rest}) => {
  return(
    <Route {...rest} render={(props) => usuarioLogeado === true ? <Component {...props} /> : <Redirect to={{pathname: '/'}} />}/>
    // <Route {...rest} render={()=> {usuarioLogeado===true? <Component />: <Redirect/>}}/>
  )
}

const PublicRoute = ({component: Component, usuarioLogeado, logear, ...rest }) => {
  return (
    <Route 
      {...rest} render={(props) => usuarioLogeado === false  ? <Component { ...props}  logear= {logear}/>: <Redirect to={{pathname: '/home'}}/>}
    />
  )
}
export default App;
