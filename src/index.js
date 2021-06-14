import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SeleccionarMes from './vistas/producto/SeleccionarMes'
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import ClienteAbm from './vistas/clientes/ClienteAbm';
import SubirDatosPacientes from './vistas/producto/subirDatosPacientes';
import SubirPeriodos from './vistas/producto/SubirPeriodos';
import SubirDatos from './vistas/producto/SubirDatos'

// import Pruebagrid from './Pruebagrid/Pruebagrid';
// import Welcome from './Welcome';
// import Testboostrap from './Testbootstrap';


ReactDOM.render(
  <React.StrictMode>
<App />
{/* <SeleccionarMes/> */}
{/* <SubirDatos /> */}
{/* <SubirPeriodos /> */}
{/* <SubirDatosPacientes /> */}

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
