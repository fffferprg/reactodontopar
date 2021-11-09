import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { Link, NavLink, withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext, MdFindReplace } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import PopupClientes from '../clientes/PopupClientes';
import PopupProductos from './PopupProductos';
import PopupZonas from './PopupZonas';
import PopupDientes from './PopupDientes';
import PopupPeriodos from './PopupPeriodos';
import PopupTercerosMolares from '../producto/PopupTercerosMolares';
import PopupDientesTemporarios from '../producto/PopupDientesTemporarios'
import Zonas from '../producto/Zonas';
import NumberFormat from 'react-number-format';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { LinkContainer } from 'react-router-bootstrap';


class ProductoVenta extends Component {
    state={
        // fechaNumero:'',
        clienteNombre:'',
        clienteCodigo:0,
        clienteDocumento:0,
        clienteTelefono:0,
        mostrarFiltro:true,
        filtroMoviClienteNombre:'',
        filtroMoviProductoCodigo:'',
        filtroMoviProductoNombre:'',
        filtroCodigo:'',
        filtroProductoNombre:'',
        filtroClienteNombre:'',
        filtroClienteCodigo:'',
        filtroMoviNumeroFao:'',
        filtroMoviFecha:'',
        filtroMoviStatus:'',
        filtroMoviPeriodoAnho:'',
        filtroMoviPeriodoMes:'',
        filtroPeriodoAnho:'',
        filtroPeriodoMes:'',
        listaMovimientos: [],
        listaProductos: [],
        listaClientes: [],
        moviClienteEditarId:null,
        clienteEmail:'',
        moviClienteFechaNacimiento:'', 
        moviFecha:'13-04-2021',
        moviClienteCodigo:'',
        moviClienteNombre:'',
        moviClienteCarnetEmpleado:'',
        moviClienteEmpleadoNombre:'',
        moviProductoCodigo:'',
        moviProductoNombre:'',
        moviProductoCantidad:0,
        moviProductoGarantia:0,
        moviPrecioVenta:'',
        moviProductoTipo:'',
        moviClienteCarnetEmpleado:'',
        moviClienteEmpleadoNombre:'',
        moviProcedimientoDescripcion:'',
        moviProductoTotal:0,
        showProductoModal: false,
        showClienteModal: false,
        showZonaModal: false,
        showDienteModal: false,
        showPeriodoModal: false,
        showTemporariosModal: false,
        sumaTotal:0,
        sumatoriaBrutoFinal:0,
        sumatoriaNetoFinal:0,
        moviNumeroFao:'',
        textoFechaNacimiento:'',
        textoCarnet:'',
        textoG$:'',
        zonasSeleccionadas:[],
        listaZonas : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        dientesZonas : [], //LISTA QUE SE VA A ENVIAR A DB 
        listaSeleccionados : [],
        dientesSeleccionados:[],
        seleccionados:[],
        listaDientes : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        listaDientesTemporarios : [],
        dientesDientes : [], //LISTA QUE SE VA A ENVIAR A DB 
        dientesTemporarios : [],
        listaTerceros : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        dientesTerceros : [], //LISTA QUE SE VA A ENVIAR A DB 
        tercerosSeleccionados :[],
        emailUsuario : '',
        menor: false,
        imputDisabled:true,
        idAgregado:'',
        listaMovimientosTemporal:[],
        moviPeriodo:'',
        filtroMoviPeriodoAnho:'',
        filtroMoviPeriodoMes:'',
        listaPeriodos:[],
        }

    
    componentDidMount(){
        this.obtenerMovimientos()
        this.obtenerProductos()
        this.obtenerClientes()
        this.obtenerZonas()
        this.obtenerPeriodos()
        this.obtenerDientes()
        this.obtenerTercerosMolares()
        this.cargarStateSumatoriaFinal()
        this.obtenerDientesTemporarios()
        // this.calcularEdad()
    }

 
    manejarModal=()=>{
        // console.log('PRODUCTOTIPO:',this.state.moviProductoTipo)
        switch(this.state.moviProductoTipo){
            case 'zona': this.openZonaModal()
            break;
            case 'diente':this.openDienteModal()
            break;
            case 'tercer molar':this.openTercerosModal()
            break;
            case 'dientes temporarios':this.openTemporariosModal()
            break;
            default:
        }
    }
 /////// MODAL DIENTES TEMPORARIOS //////////////////////////////////////////////////////////////////
 obtenerDientesTemporarios=()=>{   // es para crear los checkbox
    let listaTemporal = []
   db.collection('dientestemporarios').orderBy('dienteNumero').get()
   .then ((snap)=>{
    snap.forEach(documento =>{
        listaTemporal.push({
            id : documento.id,
            ...documento.data()
        })
    })
    this.setState({
        listaDientesTemporarios : listaTemporal,
    })
    console.log('LISTATEMPORARIOS:',this.state.listaDientesTemporarios)
   })  
}
renderDientesTemporarios=()=>{
    return this.state.listaDientesTemporarios.map((temporario) => {
        let marcar = this.state.dientesTemporarios.includes(`${temporario.dienteNombre}`);
        return (
            <Form.Group key={temporario.id} >
                <Form.Check type="checkbox" label={`${temporario.dienteNombre}`} name={`${temporario.dienteNombre}`}  onChange={this.manejarCheckBoxDientesTemporarios} checked = {marcar} />
            </Form.Group> 
        )
    })
}
   manejarCheckBoxDientesTemporarios=(evento)=>{
        // console.log(evento.target.name)
        // console.log(evento.target.checked)	
        // ESTO ES PARA AGREGAR ROLES
        if (evento.target.checked){  // aqui se marco el checkbox
            let existe = this.state.dientesTemporarios.includes(`${evento.target.name}`);
             if(!existe){
                 let nombreTemporario = evento.target.name
                 this.setState({
                    dientesTemporarios : [...this.state.dientesTemporarios, nombreTemporario]
                 })
                //  this.props.atributos.zonasSeleccionadas = [...this.state.dientesZonas, nombreZona]
             }
            
         }
         // ESTO ES PARA REMOVER ROLES
         if (!evento.target.checked){  // aqui se desmarco el checkbox
             let existe = this.state.dientesTemporarios.includes(`${evento.target.name}`);
             if(existe){
                 let nombreTemporario = evento.target.name
                 let temporariosFiltrados = this.state.dientesTemporarios.filter((temporarioActual)=>{
                     return temporarioActual != nombreTemporario
                 })
                 console.log('tercerosFiltrados',temporariosFiltrados)
                 this.setState({
                    dientesTemporarios : temporariosFiltrados,
                 })
                //  this.props.atributos.zonasSeleccionadas = zonasFiltradas
             }
         }
         
     }
openTemporariosModal=()=>{
    this.setState({
      showTemporariosModal: true
    })
    }

closeTemporariosModal=()=>{

      let descripcionTemporal = ''
            //  console.log('DESCRIPCION TEMPORAL',this.descripcionTemporal)
             this.state.dientesTemporarios.forEach(elemento=>{
                 descripcionTemporal = descripcionTemporal+' -'+elemento.substring(0, 2)
                 
             })
             this.setState({
                moviProcedimientoDescripcion : descripcionTemporal,
                seleccionados : this.state.dientesTemporarios,
               })
               this.setState({
                // moviProductoCantidad:this.state.seleccionados.length(),
                showTemporariosModal: false
                
              })
              this.state.moviProductoCantidad=this.state.dientesTemporarios.length
            //   console.log('seleccionados',this.state.seleccionados)
            //   console.log('this.state.dientesTerceros',this.state.dientesTerceros.length)
            //   console.log('moviProductoCantidad',this.state.moviProductoCantidad)

    } 
 /////// MODAL TERCEROS MOLARES //////////////////////////////////////////////////////////////////
 obtenerTercerosMolares=()=>{   // es para crear los checkbox
    let listaTemporal = []
   db.collection('tercerosmolares').orderBy('terceroNumero').get()
   .then ((snap)=>{
    snap.forEach(documento =>{
        listaTemporal.push({
            id : documento.id,
            ...documento.data()
        })
    })
    this.setState({
        listaTerceros : listaTemporal,
    })
    // console.log('LISTATERCEROS:',this.state.listaTerceros)
   })  
}
renderTercerosMolares=()=>{
    return this.state.listaTerceros.map((tercero) => {
        let marcar = this.state.dientesTerceros.includes(`${tercero.terceroNombre}`);
        return (
            <Form.Group key={tercero.id} >
                <Form.Check type="checkbox" label={`${tercero.terceroNombre}`} name={`${tercero.terceroNombre}`}  onChange={this.manejarCheckBoxTercerosMolares} checked = {marcar} />
            </Form.Group> 
        )
    })
}
   manejarCheckBoxTercerosMolares=(evento)=>{
        // console.log(evento.target.name)
        // console.log(evento.target.checked)	
        // ESTO ES PARA AGREGAR ROLES
        if (evento.target.checked){  // aqui se marco el checkbox
            let existe = this.state.dientesTerceros.includes(`${evento.target.name}`);
             if(!existe){
                 let nombreTercero = evento.target.name
                 this.setState({
                    dientesTerceros : [...this.state.dientesTerceros, nombreTercero]
                 })
                //  this.props.atributos.zonasSeleccionadas = [...this.state.dientesZonas, nombreZona]
             }
            
         }
         // ESTO ES PARA REMOVER ROLES
         if (!evento.target.checked){  // aqui se desmarco el checkbox
             let existe = this.state.dientesTerceros.includes(`${evento.target.name}`);
             if(existe){
                 let nombreTercero = evento.target.name
                 let tercerosFiltrados = this.state.dientesTerceros.filter((terceroActual)=>{
                     return terceroActual != nombreTercero
                 })
                 console.log('tercerosFiltrados',tercerosFiltrados)
                 this.setState({
                    dientesTerceros : tercerosFiltrados,
                 })
                //  this.props.atributos.zonasSeleccionadas = zonasFiltradas
             }
         }
         
     }
openTercerosModal=()=>{
    this.setState({
      showTercerosModal: true
    })
    }

closeTercerosModal=()=>{

      let descripcionTemporal = ''
            //  console.log('DESCRIPCION TEMPORAL',this.descripcionTemporal)
             this.state.dientesTerceros.forEach(elemento=>{
                 descripcionTemporal = descripcionTemporal+' -'+elemento.substring(0, 2)
                 
             })
             this.setState({
                moviProcedimientoDescripcion : descripcionTemporal,
                seleccionados : this.state.dientesTerceros,
               })
               this.setState({
                // moviProductoCantidad:this.state.seleccionados.length(),
                showTercerosModal: false
                
              })
              this.state.moviProductoCantidad=this.state.dientesTerceros.length
            //   console.log('seleccionados',this.state.seleccionados)
            //   console.log('this.state.dientesTerceros',this.state.dientesTerceros.length)
            //   console.log('moviProductoCantidad',this.state.moviProductoCantidad)

    } 

    /////// MODAL DIENTES ZONAS //////////////////////////////////////////////////////////////////
    obtenerZonas=()=>{   // es para crear los checkbox
        let listaTemporal = []
       db.collection('dienteszonas').orderBy('zonaNumero').get()
       .then ((snap)=>{
        snap.forEach(documento =>{
            listaTemporal.push({
                id : documento.id,
                ...documento.data()
            })
        })
        this.setState({
            listaZonas : listaTemporal,
        })
       })  
    }
    renderZonas=()=>{
        let zonasParaRender = []
        if(this.state.moviProductoCodigo=='70110008'){
            zonasParaRender.push(this.state.listaZonas[0],this.state.listaZonas[1])
        }else{
            zonasParaRender =this.state.listaZonas}

        return zonasParaRender.map((zona) => {
                let marcar = this.state.dientesZonas.includes(`${zona.zonaNombre}`);
            return (
                <Form.Group key={zona.id} >
                    <Form.Check type="checkbox" label={`${zona.zonaNombre}`} name={`${zona.zonaNombre}`}  onChange={this.manejarCheckBoxZonas} checked = {marcar} />
                </Form.Group> 
            )
        })
    }
       manejarCheckBoxZonas=(evento)=>{
            // console.log(evento.target.name)
            // console.log(evento.target.checked)	
            // ESTO ES PARA AGREGAR ROLES
            if (evento.target.checked){  // aqui se marco el checkbox
                let existe = this.state.dientesZonas.includes(`${evento.target.name}`);
                 if(!existe){
                     let nombreZona = evento.target.name
                     this.setState({
                        dientesZonas : [...this.state.dientesZonas, nombreZona]
                     })
                    //  this.props.atributos.zonasSeleccionadas = [...this.state.dientesZonas, nombreZona]
                 }
                
             }
             // ESTO ES PARA REMOVER ROLES
             if (!evento.target.checked){  // aqui se desmarco el checkbox
                 let existe = this.state.dientesZonas.includes(`${evento.target.name}`);
                 if(existe){
                     let nombreZona = evento.target.name
                     let zonasFiltradas = this.state.dientesZonas.filter((zonaActual)=>{
                         return zonaActual != nombreZona
                     })
                     this.setState({
                        dientesZonas : zonasFiltradas,
                        moviProductoCantidad:zonasFiltradas.length
                     })
                    //  this.props.atributos.zonasSeleccionadas = zonasFiltradas
                 }
             }
             
         }
    openZonaModal=()=>{
        this.setState({
          showZonaModal: true
        })
        }

    closeZonaModal=()=>{
 
          let descripcionTemporal = ''
                //  console.log('DESCRIPCION TEMPORAL',this.descripcionTemporal)
                 this.state.dientesZonas.forEach(elemento=>{
                     descripcionTemporal = descripcionTemporal+' -'+elemento.substring(0, 7)
                     
                 })
                 this.setState({
                    moviProcedimientoDescripcion : descripcionTemporal,
                    seleccionados : this.state.dientesZonas

                   })
                   this.setState({
                    showZonaModal: false
                  })
                  this.state.moviProductoCantidad=this.state.dientesZonas.length

        } 

        /////////// MODAL DIENTES DIENTES ////////////////////////////////////
        obtenerDientes=()=>{   // es para crear los checkbox
            let listaTemporal = []
           db.collection('dientespermanentes').orderBy('dienteNumero').get()
           .then ((snap)=>{
            snap.forEach(documento =>{
                listaTemporal.push({
                    id : documento.id,
                    ...documento.data()
                })
            })
            this.setState({
                listaDientes : listaTemporal,
            })
            // console.log('LISTA TEMPORAL:',listaTemporal)
           })  
        }
        renderDientes=()=>{
            // console.log('LISTA DIENTES:',this.state.listaDientes)
            return this.state.listaDientes.map((diente) => {
                let marcar = this.state.dientesDientes.includes(`${diente.dienteNombre}`);
                return (
                    <Form.Group key={diente.id} >
                        <Form.Check type="checkbox" label={`${diente.dienteNombre}`} name={`${diente.dienteNombre}`}  onChange={this.manejarCheckBoxDientes} checked = {marcar} />
                    </Form.Group> 
                )
            })
        }
           manejarCheckBoxDientes=(evento)=>{
                // console.log(evento.target.name)
                // console.log(evento.target.checked)	
                // ESTO ES PARA AGREGAR ROLES
                if (evento.target.checked){  // aqui se marco el checkbox
                    let existe = this.state.dientesDientes.includes(`${evento.target.name}`);
                     if(!existe){
                         let nombreDiente = evento.target.name
                         this.setState({
                            dientesDientes : [...this.state.dientesDientes, nombreDiente]
                         })
                        //  this.props.atributos.zonasSeleccionadas = [...this.state.dientesZonas, nombreZona]
                     }
                 }
                 // ESTO ES PARA REMOVER ROLES
                 if (!evento.target.checked){  // aqui se desmarco el checkbox
                     let existe = this.state.dientesDientes.includes(`${evento.target.name}`);
                     if(existe){
                         let nombreDiente = evento.target.name
                         let dientesFiltrados = this.state.dientesDientes.filter((dienteActual)=>{
                             return dienteActual != nombreDiente
                         })
                         this.setState({
                            dientesDientes : dientesFiltrados,
                            moviProductoCantidad : dientesFiltrados.length
                         })
                        //  this.props.atributos.zonasSeleccionadas = zonasFiltradas
                     }
                 }
                 
             }
        openDienteModal=()=>{
            this.setState({
              showDienteModal: true
            })
            }
    
        closeDienteModal=()=>{
            let descripcionTemporal = ''
                //  console.log('DESCRIPCION TEMPORAL',this.descripcionTemporal)
                 this.state.dientesDientes.forEach(elemento=>{
                     descripcionTemporal = descripcionTemporal+' -'+elemento.substring(0, 2)
                    //  console.log('ELEMENTO:',elemento)
                 })
                 this.setState({
                    moviProcedimientoDescripcion : descripcionTemporal,
                    seleccionados : this.state.dientesDientes

                   })
              this.setState({
                showDienteModal: false
              }) 
              this.state.moviProductoCantidad=this.state.dientesDientes.length
            } 
        ////////////////////////////////////////////// MODAL  CLIENTE  /////////////////////////////////////////
    openClienteModal=()=>{
        this.setState({
            showClienteModal: true,
            filtroClienteNombre:'',
            filtroClienteCodigo:'',
        })
        }
    
    closeClienteModal=()=>{
            this.setState({
            showClienteModal: false
            }) 
            // console.log('NACIMIENTO:',this.moviClienteFechaNacimiento)
        }

    cargarStateSumatoriaFinal=()=>{
        this.setState({sumatoriaFinal:this.sumatoria})
    }

    capturarPrecio=(evento, name)=>{
        // console.log('evento', evento)
        // console.log('name', name)
        this.setState({[name]:evento.floatValue})
    }

    obtenerMovimientos = ()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('movimientos').orderBy('creado')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                let movimientos = {
                    id : documento.id,
                    // moviFecha : documento.data().moviFecha,
                    moviPeriodoAnho : documento.data().moviPeriodoAnho,
                    moviPeriodoMes : documento.data().moviPeriodoMes,
                    moviNumeroFao : documento.data().moviNumeroFao,
                    moviProductoCodigo : documento.data().moviProductoCodigo,
                    moviProductoNombre : documento.data().moviProductoNombre,
                    moviClienteNombre : documento.data().moviClienteNombre,
                    moviProcedimientoDescripcion : documento.data().moviProcedimientoDescripcion,
                    // moviPrecioVenta : documento.data().moviPrecioVenta,
                    moviProductoTotal : documento.data().moviProductoTotal,
                    moviProductoGarantia : documento.data().moviProductoGarantia,
                    moviStatus:documento.data().moviStatus,

                    moviClienteCodigo : documento.data().moviClienteCodigo,
                }
                listaTemporal.push(movimientos)
            })
            this.setState({
                listaMovimientos : listaTemporal.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
            /////////////////////////////////////////////////////////
            /////////////////////////////////////////
            //////////////////////////////////////////////////////////
            // console.log('this.state.listaMovimientos',this.state.listaMovimientos)
            this.state.listaMovimientos.forEach(elemento =>{
                // if(elemento.moviStatus=='historico'){
                //     let historicoborrado = elemento
                //     console.log('historicoborrado',historicoborrado)
                //     db.collection('movimientoshistoricos').add({
                //         ...historicoborrado,
                //         creado : moment().unix(),
                //     })
                //     .then(docHistoricoRef =>{
                //         let idHistoricoAgregado=docHistoricoRef.id
                //         console.log('idHistoricoAgregado',idHistoricoAgregado)
                //         toast.success('HISTORICO AGREGADO', {
                //             position: "bottom-right",
                //             autoClose: 1000,
                //             hideProgressBar: false,
                //             closeOnClick: true,
                //             pauseOnHover: true,
                //             draggable: true,
                //             progress: undefined,
                //             });
                //     })
                //     .catch((error)=>{
                //         console.log(error)
                //     })
                // }


            }
            ,(error)=>{
            alert(error)
            console.log(error)
        })
        })


}
///////////////////////// MODAL PERIODOS /////////////////////////////
openPeriodoModal=()=>{
    this.setState({
      showPeriodoModal: true
    })
    }

closePeriodoModal=()=>{
      this.setState({
        showPeriodoModal: false
      }) 
    }    


obtenerPeriodos =()=>{
    let listaPeriodosTemporal = []
    db.collection('periodos').orderBy('codigo').get()
    .then((periodos)=>{periodos.forEach((periodo)=>{listaPeriodosTemporal.push({
                id : periodo.id,
                ...periodo.data()      
                // producto : producto.producto  // ES LO MISMO QUE LA LINEA ANTERIOR
            })
        })
        this.setState({
            listaPeriodos : listaPeriodosTemporal
        })
        // console.log('this.state.listaPeriodos:',this.state.listaPeriodos)
    })
    .catch((error)=>{
        alert(error)
    })
}

renderListaPeriodos = () => {
    return this.state.listaPeriodos
    .filter((documento)=>{
        return (documento.periodoAnho.toString().indexOf(this.state.filtroPeriodoAnho)>=0)
        && (documento.periodoMes.toString().indexOf(this.state.filtroPeriodoMes)>=0)
    }) 

    .map((documento) => {
        return (
            // key es un identificador unico
            <tr key={documento.id}> 
                <td>{documento.periodoAnho}</td>
                <td>{documento.periodoMes}</td>
                <td><a href="#" onClick={()=>{this.setState({
                    periodoAnho:documento.periodoAnho,
                    periodoMes:documento.periodoMes,
                    moviPeriodo:documento.periodoAnho+'-'+documento.periodoMes,
                    showPeriodoModal: false}
                    );  
                    }}
                    >
                    SELECCIONAR
                    </a></td>
            </tr>
        )
    })
}
///////////////////////// MODAL PRODUCTOS /////////////////////////////
openProductoModal=()=>{
        
    this.setState({
        filtroCodigo:'',
        filtroProductoNombre:'',
        moviProcedimientoDescripcion:'',
        showProductoModal: true
    })
    }

closeProductoModal=()=>{
    // console.log('MOVIPRODUCTONOMBRE',this.state.moviProductoNombre)
    // this.setState({
    //     seleccionados : this.state.moviProductoNombre
    //    })

      this.setState({
        showProductoModal: false
      }) 
    }    


obtenerProductos =()=>{
    let listaProductosTemporal = []
    db.collection('productos').get()
    .then((productos)=>{productos.forEach((producto)=>{listaProductosTemporal.push({
                id : producto.id,
                ...producto.data()      
                // producto : producto.producto  // ES LO MISMO QUE LA LINEA ANTERIOR
            })
        })
        this.setState({
            listaProductos : listaProductosTemporal
        })
        // console.log('LISTAPRODUCTOTEMPORAL:',this.state.listaProductos)
    })
    .catch((error)=>{
        alert(error)
    })
}

renderListaProductos = () => {
    return this.state.listaProductos
    .filter((documento)=>{
        return (documento.productoNombre.toLowerCase().indexOf(this.state.filtroProductoNombre.toLowerCase())>=0)
        && (documento.codigo.toString().indexOf(this.state.filtroCodigo)>=0)
    }) 

    .map((documento) => {
        return (
            // key es un identificador unico
            <tr key={documento.id}> 
                <td>{documento.productoNombre}</td>
                <td>{documento.codigo}</td>
                <td><a href="#" onClick={()=>{this.setState({
                    productoSeleccionado:documento, 
                    moviProductoCodigo:documento.codigo, 
                    moviProductoNombre:documento.productoNombre, 
                    moviPrecioVenta:documento.precioVenta, 
                    moviProductoGarantia:documento.productoGarantia,
                    moviProductoTipo:documento.productoTipo,
                    textoG$:'G$: ',
                    showProductoModal: false}
                    
                    );  
                    switch(documento.productoTipo){
                        case 'boca completa': this.setState({imputDisabled:true })
                        break;
                        default:this.setState({imputDisabled:false })
                    }
                    }}
                    >
                    SELECCIONAR
                    </a></td>
            </tr>
        )
    })
}

///////////////////////// MODAL CLIENTES ///////////////////////////

obtenerClientes =()=>{
    let listaClientesTemporal = []
    db.collection('clientes').get()
    .then((clientes)=>{clientes.forEach((cliente)=>{listaClientesTemporal.push({
                id : cliente.id,
                ...cliente.data()      
            })
        })
        this.setState({
            listaClientes : listaClientesTemporal
        })
        // console.log(this.state.listaClientes)
    })
    .catch((error)=>{
        alert(error)
    })
}


renderListaClientes = () => {
    // console.log('FECHA NACIMIENTO:',this.state.moviClienteFechaNacimiento)
    this.calcularEdad()
    return this.state.listaClientes
    .filter((documento)=>{
        return (documento.clienteNombre.toLowerCase().indexOf(this.state.filtroClienteNombre.toLowerCase())>=0)
        && (documento.clienteCodigo.toString().indexOf(this.state.filtroClienteCodigo)>=0)
    }) 
    .map((documento) => {
        return (
            // key es un identificador unico
            <tr key={documento.id}> 
                <td>{documento.clienteNombre}</td>
                <td>{documento.clienteCodigo}</td>
                <td><a href="#" onClick={()=>{
                    ////////////////////////////////////////////
                    
    
                    /////////////////////////////////////////////
                    this.setState({
                    clienteSeleccionado:documento, 
                    moviClienteCodigo:documento.clienteCodigo, 
                    moviClienteNombre:documento.clienteNombre, 
                    moviClienteCarnetEmpleado:documento.clienteCarnetEmpleado,
                    moviClienteEmpleadoNombre:documento.clienteEmpleadoNombre, 
                    moviClienteTelefono:documento.clienteTelefono, 
                    moviClienteFechaNacimiento:documento.clienteFechaNacimiento,
                    textoCarnet:'Carnet: ',
                    textoFechaNacimiento:'FecNac: ',
                    showClienteModal: false },
                                        // this.calcularEdad()
                    )}}>
                    SELECCIONAR
                    </a>
                </td>
            </tr>
        )
       
    })
}

calcularEdad=()=>{
    // console.log('FECHA NACIMIENTO:',this.state.moviClienteFechaNacimiento)
    let anho=this.state.moviClienteFechaNacimiento.substr(0, 4)
    let mes =this.state.moviClienteFechaNacimiento.substr(5, 2)
    let dia =this.state.moviClienteFechaNacimiento.substr(8, 2)
    let hoyAnho = new Date().getFullYear()
    let hoyMes = new Date().getMonth()+1
    let hoyDia = new Date().getDate()
    // console.log('Anyo',anho)
    // console.log('Mes',mes)
    // console.log('Dia',dia)
    // console.log('HOYANHO',hoyAnho)
    // console.log('HOYMES',hoyMes)
    // console.log('HOYDIA',hoyDia)
    let difAnho = hoyAnho-anho
    let difMes = hoyMes-mes
    let difDia = hoyDia-dia

        // console.log('DIFANHO:',difAnho)
        // console.log('DIFMES:',difMes)
        // console.log('DIFDIA:',difDia)
        if(difAnho>=49){this.state.menor = false}
        if(difAnho<=47){this.state.menor = true}
        if(difAnho=48){
            if(hoyMes>mes){ this.state.menor = false}else
            if(hoyMes<mes){this.state.menor = true}else
            if(hoyMes=mes){
                if(hoyDia<dia){this.state.menor = true}else
                if(hoyDia>=dia){this.state.menor = false}
            }
        }
    // switch(difAnho){
    //     case difAnho>=49: this.state.menor = false
    //     break;
    //     case difAnho=47: this.state.menor = true
    //     break;
    //     case difAnho=48:{
    //         switch (hoyMes){ 
    //             case hoyMes>mes: this.state.menor = false
    //             break;
    //             case hoyMes<mes: this.state.menor = true
    //             break;
    //             case hoyMes=mes :{
    //                 switch(hoyDia){
    //                     case hoyDia<dia: this.state.menor = true
    //                     break;
    //                     case hoyDia>=dia: this.state.menor = false
    //                     break;
    //                     default:
    //                 }
    //             }
    //         default:}
    //         }
    //     break;
    //     default:
    // }
    // console.log('LA PUTA QUE ME PARIO')
    // console.log('STATEMENOR:',this.state.menor)

}
renderListaMovimientos = () => {
    var sumatoria = 0
    var neto = 0
    var porcentaje = 0
    const formatoTabla = new Intl.NumberFormat('de-DE')
    return this.state.listaMovimientos
    
    .filter((documento)=>{
        return (documento.moviClienteNombre.toLowerCase().indexOf(this.state.filtroMoviClienteNombre.toLowerCase())>=0)
        // && (documento.moviFecha.toString().indexOf(this.state.filtroMoviFecha)>=0)
        && (documento.moviProductoCodigo.toString().indexOf(this.state.filtroMoviProductoCodigo)>=0)
        && (documento.moviNumeroFao.toString().indexOf(this.state.filtroMoviNumeroFao)>=0)
        && (documento.moviProductoNombre.toLowerCase().indexOf(this.state.filtroMoviProductoNombre.toLowerCase())>=0)
        && (documento.moviStatus.toLowerCase().indexOf(this.state.filtroMoviStatus.toLowerCase())>=0)
        && (documento.moviPeriodoAnho.toString().indexOf(this.state.filtroMoviPeriodoAnho.toLowerCase())>=0)
        && (documento.moviPeriodoMes.toLowerCase().indexOf(this.state.filtroMoviPeriodoMes.toLowerCase())>=0)

    }) 
    .map((documento) => {
        // if(documento.moviStatus=='ultima atencion'){
            return (
                sumatoria = sumatoria + documento.moviProductoTotal,
                porcentaje = (sumatoria*25/100),
                neto = sumatoria - porcentaje,
                this.state.sumatoriaBrutoFinal = sumatoria,
                this.state.sumatoriaNetoFinal = neto,
        
                <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                    {/* <td style={{fontSize:"12px"}}>{documento.moviFecha}</td> */}
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviPeriodoAnho}</td>                    
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviPeriodoMes}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviNumeroFao}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoCodigo}</td>
                    <td style={{fontSize:"10px"}}>{documento.moviProductoNombre}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviClienteNombre}</td>
                    {/* <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoCantidad}</td> */}
                    <td style={{fontSize:"10px"}}>{documento.moviProcedimientoDescripcion}</td>
                    <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviProductoTotal)}</td>
                    {/* <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviPrecioVenta)}</td> */}
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoGarantia}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviStatus}</td>
                    <td style={{textAlign:"center"}}> 
                            <div>
                                {/* <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Editar</Tooltip>} > 
                                    <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} />
                                </OverlayTrigger>
                                {' '}   */}
                                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Borrar</Tooltip>} > 
                                    <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} />
                                </OverlayTrigger>
                            </div>
        
                    </td>
                </tr>
            )
        // }
    })
 }

    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }

    cargarForm =(movimientoId)=>{
        // console.log (movimientoId)
        db.collection('movimientos').doc(`${movimientoId}`).get()
        .then((snap)=>{
        //   console.log(snap.data())
          this.setState({
            // moviClienteFechaNacimiento : snap.data().moviClienteFechaNacimiento, 
            // moviFecha : snap.data().moviFecha,
            moviNumeroFao : snap.data().moviNumeroFao,
            moviClienteCodigo : snap.data().moviClienteCodigo,
            moviClienteNombre : snap.data().moviClienteNombre,
            // moviClienteCarnetEmpleado : snap.data().moviClienteCarnetEmpleado,
            // moviClienteEmpleadoNombre : snap.data().moviClienteEmpleadoNombre,
            moviProductoCodigo : snap.data().moviProductoCodigo,
            moviProductoNombre : snap.data().moviProductoNombre,
            moviProductoGarantia : snap.data().moviProductoGarantia,
            // moviProductoCantidad : snap.data().moviProductoCantidad,
            moviPrecioVenta : snap.data().moviPrecioVenta,
            moviProcedimientoDescripcion : snap.data().moviProcedimientoDescripcion,
            // moviProductoTotal : snap.data().moviProductoTotal,
            moviClienteEditarId : snap.id,
            // fechaNumero : snap.data().moviFecha.replace(/-/g,''),
          })
        //   let sumar = parseInt(this.state.fechaNumero)+1
        //   console.log('EDITAR', this.state.moviClienteEditarId)
        //   console.log('ESTADO',this.state)
        //   console.log('fechaNumero:',this.state.fechaNumero)
        //   console.log('SUMAR:',sumar)
         })
        .catch((error)=>{
            alert(error)
        })
    }

    confirmarAccion = (movimientoId) => {
        confirmAlert({
          title: 'Accion borrar',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.borrarMovimiento(movimientoId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      }

      borrarMovimiento = (movimientoId) =>{
        // console.log(movimientoId)
        db.collection('movimientos').doc(movimientoId).delete()
        .then(()=>{
            // se ejecuta cuando se inserto con exito
            alert('Eliminado correctamente')   
            this.obtenerMovimientos() 

        })
        .catch((error)=>{
            // se ejecuta cuando sucede un error 
            alert(error)
        })
    }

    limpiarCampos = () => {
        this.setState({
        // clienteNombre:'',
        // clienteCodigo:0,
        // clienteDocumento:0,
        // clienteTelefono:0,
        mostrarFiltro:true,
        filtroMoviClienteNombre:'',
        filtroMoviProductoCodigo:'',
        filtroMoviProductoNombre:'',
        filtroClienteNombre:'',
        filtroClienteCodigo:'',
        filtroMoviNumeroFao:'',
        filtroMoviFecha:'',
        filtroMoviStatus:'',
        filtroMoviPeriodoAnho:'',
        filtroMoviPeriodoMes:'',
        moviPeriodo:'',
        // listaMovimientos: [],
        // listaProductos: [],
        // listaClientes: [],
        // moviClienteEditarId:null,
        // clienteEmail:'',
        moviClienteFechaNacimiento:'', 
        moviFecha:'',
        moviClienteCodigo:'',
        moviClienteNombre:'',
        moviClienteCarnetEmpleado:'',
        moviClienteEmpleadoNombre:'',
        moviProductoCodigo:'',
        moviProductoNombre:'',
        moviProductoCantidad:0,
        moviProductoGarantia:0,
        moviPrecioVenta:'',
        moviProductoTipo:'',
        moviClienteCarnetEmpleado:'',
        moviClienteEmpleadoNombre:'',
        moviProcedimientoDescripcion:'',
        moviProductoTotal:0,
        showProductoModal: false,
        showClienteModal: false,
        showZonaModal: false,
        showDienteModal: false,
        sumaTotal:0,
        sumatoriaBrutoFinal:0,
        sumatoriaNetoFinal:0,
        moviNumeroFao:'',
        textoFechaNacimiento:'',
        textoCarnet:'',
        textoG$:'',
        // zonasSeleccionadas:[],
        // listaZonas : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        // dientesZonas : [], //LISTA QUE SE VA A ENVIAR A DB 
        // listaSeleccionados : [],
        // dientesSeleccionados:[],
        // seleccionados:[],
        // listaDientes : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        // dientesDientes : [], //LISTA QUE SE VA A ENVIAR A DB 
        // listaTerceros : [],  // ESTO ES PARA CREAR LOS CHECKBOXS
        // dientesTerceros : [], //LISTA QUE SE VA A ENVIAR A DB 
        // tercerosSeleccionados :[],
        // emailUsuario : '',
        menor: false,
        imputDisabled:true,
        })
        this.obtenerMovimientos()
    }

    limpiarCamposAbajo = () => {
        this.setState({
            clienteNombre:'',
            clienteCodigo:0,
            clienteDocumento:0,
            clienteTelefono:0,
            mostrarFiltro:true,
            filtroMoviClienteNombre:'',
            filtroMoviProductoCodigo:'',
            filtroMoviProductoNombre:'',
            filtroProductoNombre:'',
            filtroCodigo:'',
            listaMovimientos: [],
            moviClienteEditarId:null,
            clienteEmail:'',
            // moviClienteFechaNacimiento:'', 
            // moviFecha:'',
            // moviClienteCodigo:0,
            // moviClienteNombre:'',
            // moviClienteCarnetEmpleado:0,
            // moviClienteEmpleadoNombre:'',
            moviProductoCodigo:'',
            moviProductoNombre:'',
            moviProductoGarantia:0,
            moviProductoCantidad:0,
            moviPrecioVenta:'',
            moviProcedimientoDescripcion:'',
            moviProductoTotal:0,
            textoG$:'',
            zonasSeleccionadas:[],
            seleccionados : [],
        })
        this.obtenerMovimientos()
    }

    guardar=()=>{
                                    // console.log('LISTAMOVIMIENOTS',this.state.listaMovimientos)
                                    // console.log(this.state)
                                    // console.log('PRODUCTO TEMPORAL:',productoTemporal)
                                    // console.log('ZONAS SELECCIONADAS:',this.state.dientesZonas)
                                    // this.calcularEdad()
                                    // console.log('MENOR:',this.state.menor)
        let fechaNumero = ''
        this.state.moviFecha= moment().format('YYYY-MM-DD')
        fechaNumero = this.state.moviFecha.replace(/-/g,'')
        console.log('fechaNumero',fechaNumero)
        let datosMovimmientos = {
            moviFecha : this.state.moviFecha,
            moviNumeroFao : this.state.moviNumeroFao,
            moviClienteCodigo : this.state.moviClienteCodigo,
            moviClienteNombre : this.state.moviClienteNombre,
            moviClienteTelefono : this.state.moviClienteTelefono,
            moviProductoCodigo : this.state.moviProductoCodigo,
            moviProductoNombre : this.state.moviProductoNombre,
            moviProductoGarantia: this.state.moviProductoGarantia,
            moviPrecioVenta : this.state.moviPrecioVenta,
            moviProcedimientoDescripcion : this.state.moviProcedimientoDescripcion,
            moviPeriodoAnho : this.state.periodoAnho,
            moviPeriodoMes : this.state.periodoMes,
            moviFechaFundacion : '',
        }
        if(this.state.moviClienteEditarId) {
            db.collection('movimientos').doc(`${this.state.moviClienteEditarId}`).update(datosMovimmientos)
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                alert('Editado correctamente')
                this.limpiarCampos()  
                this.obtenerMovimientos()  
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
            // console.log(datosMovimmientos)       

        } else{
            console.log('PRODUCTOTIPO:',this.state.moviProductoTipo)
            switch(this.state.moviProductoTipo){
                case 'boca completa': this.state.moviProcedimientoDescripcion= this.state.moviProductoNombre
                this.state.seleccionados [0] = this.state.moviProductoNombre
                this.state.moviProductoCantidad=1
                console.log('DESCRIPCION:',this.state.moviProcedimientoDescripcion)
                break;
                default : {if(!this.state.seleccionados [0]){
                    this.state.moviProcedimientoDescripcion= ''
                }}
            }
            console.log('DESCRIPCION:',this.state.moviProcedimientoDescripcion) 
           
            // if(!this.state.seleccionados[0]){
            //     this.state.seleccionados [0] = this.state.moviProductoNombre
            //     this.state.moviProcedimientoDescripcion= this.state.moviProductoNombre
            // }

                                      // PARA GUARDAR
            if(this.state.moviPeriodo!='' 
            && this.state.moviClienteCodigo!=0 
            && this.state.moviNumeroFao!=0 
            && this.state.moviProductoCodigo!=0
            // && this.state.seleccionados[0]
            && this.state.moviProcedimientoDescripcion!=''
            ){ 
                console.log('this.state.moviProductoCantidad:',this.state.moviProductoCantidad)
                console.log('this.state.moviPrecioVenta:',this.state.moviPrecioVenta)
            this.state.listaMovimientosTemporal=this.state.listaMovimientos
            // this.state.seleccionados.forEach(elemento =>{
                // this.state.moviProcedimientoDescripcion=elemento
                db.collection('movimientos').add({
                    ...datosMovimmientos,
                    creado : moment().unix(),
                    // moviProcedimientoDescripcion : elemento,
                    moviProcedimientoDescripcion : this.state.moviProcedimientoDescripcion,
                    moviProductoTotal : this.state.moviProductoCantidad*this.state.moviPrecioVenta,
                    moviStatus : 'ultima atencion',
                })
                
                // .then(()=>{
                .then(docRef =>{
                    this.state.idAgregado=docRef.id
                    this.manejarHistorial()
                    this.limpiarCamposAbajo()  
                    toast.success('Insertado correctamente', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                        this.setState({
                            dientesZonas : [],
                            dientesDientes : [],
                        })
                        // this.closeModal()
                })
                .catch((error)=>{
                    // se ejecuta cuando sucede un error 
                    // alert(error)
                    console.log(error)
                })
                this.manejarHistorial()
            // })     
            }else {
                alert('Los campos con * son obligatorios')  
            }
            // console.log (datosMovimmientos)
        }    
    }
manejarHistorial=()=>{
    // console.log('this.state.listaMovimientosTemporal',this.state.listaMovimientosTemporal)
    this.state.listaMovimientosTemporal.forEach(movimiento=>{
                                                                // console.log('movimiento.moviClienteCodigo:',movimiento.moviClienteCodigo)
                                                                // console.log('this.state.moviClienteCodigo:',this.state.moviClienteCodigo)
                                                                // console.log('movimiento.moviProductoCodigo:',movimiento.moviProductoCodigo)
                                                                // console.log('this.state.moviProductoCodigo:',this.state.moviProductoCodigo)
                                                                // console.log('movimiento.moviProcedimientoDescripcion:',movimiento.moviProcedimientoDescripcion)
                                                                // console.log('this.state.moviProcedimientoDescripcion:',this.state.moviProcedimientoDescripcion)
                                                                // console.log('this.state.idAgregado:',this.state.idAgregado)
                                                                // console.log('movimiento.id:',movimiento.id)
                                                                // console.log('movimiento.moviStatus:',movimiento.moviStatus)

        if(movimiento.moviClienteCodigo == this.state.moviClienteCodigo
            && movimiento.moviProductoCodigo == this.state.moviProductoCodigo
            // && movimiento.moviProcedimientoDescripcion == this.state.moviProcedimientoDescripcion
            && movimiento.id != this.state.idAgregado
            // && movimiento.moviStatus == 'ultima atencion'){
            // && movimiento.moviStatus == 'PRIMERA CARGA'){
            && movimiento.moviStatus != 'historico'){
                    db.collection('movimientos').doc(`${movimiento.id}`).update({moviStatus:'historico'})
                .then(()=>{
                    // se ejecuta cuando se inserto con exito
                    // alert('HISTORICO PROCESADO')
                })
                .catch((error)=>{
                    // se ejecuta cuando sucede un error 
                    alert(error)
                })
        }
        // if(movimiento.moviStatus == 'PRIMERA CARGA'
        //     && movimiento.moviNumeroFao == this.state.moviClienteCodigo
        //     && movimiento.moviProductoCodigo == this.state.moviProductoCodigo
        //     && movimiento.id != this.state.idAgregado){
        //     // && movimiento.moviStatus != 'historico'){
        //             db.collection('movimientos').doc(`${movimiento.id}`).update({moviStatus:'historico'})
        //         .then(()=>{
        //             // se ejecuta cuando se inserto con exito
        //             alert('HISTORICO PROCESADO')
        //         })
        //         .catch((error)=>{
        //             // se ejecuta cuando sucede un error 
        //             alert(error)
        //         })
        // }
    })
}
    // exportarExcel=()=>{
    //     return 
    //     <div align = "center">
    //     <ReactHTMLTableToExcel 
    //     id="botonExportarExcel"
    //     className = "btn btn-primary"
    //     table = "tablaVentas"
    //     fileName = "Procedimientos Aprobados"
    //     sheet = "Procedimientos Aprobados"
    //     buttonText = "Excel"
    //     />
    //     </div>
    // }

    render() {
        // console.log('VENTAS ZONAS SELECCIONADAS:',this.state.dientesZonas)
        // console.log('MENOR:',this.state.menor)
        // console.log('DIFANHO:',this.difAnho)
        // console.log('DIFMES:',this.difMes)
        // console.log('DIFDIA:',this.difDia)
        const formatoFinal = new Intl.NumberFormat('de-DE')
        return (
            <div>
                 <Form>
                    {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}>  */}
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>PROCEDIMIENTOS APROBADOS</h4></Col>
                   
                    </Row>

                    <Row >

                        {/* <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Fecha *</Form.Label>
                                <Form.Control type="date" size="sm"  name="moviFecha" value = {this.state.moviFecha} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col> */}
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Expediente *</Form.Label>
                                <Form.Control type="number" size="sm"  name="moviClienteCodigo" value = {this.state.moviClienteCodigo} onChange={this.capturarTecla} onClick={this.openClienteModal} />
                            </Form.Group>                        
                        </Col>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Periodo *</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviPeriodo" value = {this.state.moviPeriodo} onChange={this.capturarTecla} onClick={this.openPeriodoModal} />
                            </Form.Group>                        
                        </Col>

                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Nro.FAO. *</Form.Label>
                                <Form.Control type="number" size="sm" name="moviNumeroFao" value={this.state.moviNumeroFao} onChange={this.capturarTecla} />
                            </Form.Group>
                        </Col>

                        <Col md={3} sm = {12} xs = {12}>{this.state.moviClienteNombre} {this.state.textoFechaNacimiento}{this.state.moviClienteFechaNacimiento}
                            {/* <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Paciente</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviClienteNombre" value = {this.state.moviClienteNombre} onChange={this.capturarTecla} disabled />
                            </Form.Group>                         */}
                        </Col> 
                        <Col md={2} sm = {12} xs = {12}>{this.state.textoCarnet}{this.state.moviClienteCarnetEmpleado}{this.state.moviClienteEmpleadoNombre}
                            {/* <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Fec.Nacimiento</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviClienteFechaNacimiento" value = {this.state.moviClienteFechaNacimiento} onChange={this.capturarTecla} disabled/>
                            </Form.Group>                         */}
                        </Col>
                        {/* <Col md={1} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Carnet</Form.Label>
                                <Form.Control type="number" size="sm"  name="moviClienteCarnetEmpleado" value = {this.state.moviClienteCarnetEmpleado} onChange={this.capturarTecla} disabled/>
                            </Form.Group>                        
                        </Col> */}
                        {/* <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Empleado</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviClienteEmpleadoNombre" value = {this.state.moviClienteEmpleadoNombre} onChange={this.capturarTecla} disabled/>
                            </Form.Group>                        
                        </Col>  */}
                    </Row>    
                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Cod.Procedimiento *</Form.Label>
                                <Form.Control type="number" size="sm"  name="moviProductoCodigo" value = {this.state.moviProductoCodigo} onChange={this.capturarTecla}  onClick={this.openProductoModal} />
                            </Form.Group>                        
                        </Col>
                        {/* <Col md={1} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Cant. *</Form.Label>
                                <Form.Control type="number" size="sm" name="moviProductoCantidad" value={this.state.moviProductoCantidad} onChange={this.capturarTecla} onClick={this.openZonaModal} />
                            </Form.Group>
                        </Col> */}
                        <Col md={4}>
                            <Form.Group>
                                    <Form.Label style={{fontSize:"14px"}}>Dientes/Zonas *</Form.Label>
                                    <Form.Control type="text"  size="sm" name="moviProcedimientoDescripcion" value = {this.state.moviProcedimientoDescripcion} onChange={this.manejarModal} onClick={this.manejarModal} disabled ={this.state.imputDisabled}/>
                            </Form.Group>
                        </Col>

                        <Col md={3} sm = {12} xs = {12}>{this.state.moviProductoNombre}
                            {/* <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Procedimiento</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviProductoNombre" value = {this.state.moviProductoNombre} onChange={this.capturarTecla} disabled/>
                            </Form.Group>                         */}
                        </Col> 
                        <Col md={2} sm = {12} xs = {12}>{this.state.textoG$}{formatoFinal.format(this.state.moviPrecioVenta)}
                        {/* <Col md={2} sm = {12} xs = {12}>{this.state.moviPrecioVenta} */}
                            {/* <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Arancel</Form.Label>
                                <Form.Control type="number" size="sm"  name="moviPrecioVenta" value = {formatoFinal.format(this.state.moviPrecioVenta)} onChange={this.capturarPrecio} disabled />
                            </Form.Group>                         */}
                        </Col>
                    </Row>
                    <Row>

                       
                        <Col md={12} sm = {12} xs = {12}>
                                <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}{' '}{' '}
                                <Button variant = "info" size="sm"  onClick={this.limpiarCampos}>Cambiar Paciente</Button>{' '}
                                {/* <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>{' '} */}
                                <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                                    {/* <div align = "center">
                                    <ReactHTMLTableToExcel 
                                    id="botonExportarExcel"
                                    className = "btn btn-primary"
                                    table = "tablaVentas"
                                    fileName = "Procedimientos Aprobados"
                                    sheet = "Procedimientos Aprobados"
                                    buttonText = "Excel"
                                    />
                                </div> */}
                                <PopupProductos 
                                    propsShowProductoModal={this.state.showProductoModal} 
                                    funcionCloseProductoModal={this.closeProductoModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionGuardar={this.guardar}
                                    funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    funcionRenderListaProductos={this.renderListaProductos}
                                    funcionLimpiarCampos={this.limpiarCampos}
                                    funcionLimpiarCamposAbajo={this.limpiarCamposAbajo}
                                    atributos = {this.state}/>
                                <PopupClientes
                                    propsShowClienteModal={this.state.showClienteModal} 
                                    funcionCloseClienteModal={this.closeClienteModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionGuardar={this.guardar}
                                    // funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    funcionRenderListaClientes={this.renderListaClientes}
                                    funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                                <PopupZonas
                                    propsShowZonaModal={this.state.showZonaModal} 
                                    // propsZonasSeleccionadas ={this.state.zonasSeleccionadas} 
                                    funcionCloseZonaModal={this.closeZonaModal} 
                                    funcionCapturarTecla={this.capturarTecla}
                                    funcionRenderZonas = {this.renderZonas} 
                                    // funcionGuardar={this.guardar}
                                    // funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    // funcionRenderListaClientes={this.renderListaClientes}
                                    // funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                                <PopupDientes
                                    propsShowDienteModal={this.state.showDienteModal} 
                                    // propsZonasSeleccionadas ={this.state.zonasSeleccionadas} 
                                    funcionCloseDienteModal={this.closeDienteModal} 
                                    funcionCapturarTecla={this.capturarTecla}
                                    funcionRenderDientes = {this.renderDientes} 
                                    // funcionGuardar={this.guardar}
                                    // funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    // funcionRenderListaClientes={this.renderListaClientes}
                                    // funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                                <PopupTercerosMolares
                                    propsShowTercerosModal={this.state.showTercerosModal} 
                                    funcionCloseTercerosModal={this.closeTercerosModal} 
                                    funcionCapturarTecla={this.capturarTecla}
                                    funcionRenderTercerosMolares = {this.renderTercerosMolares} 
                                    atributos = {this.state}/>
                                <PopupPeriodos
                                    propsShowPeriodoModal={this.state.showPeriodoModal} 
                                    funcionClosePeriodoModal={this.closePeriodoModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionGuardar={this.guardar}
                                    // funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    funcionRenderListaPeriodos={this.renderListaPeriodos}
                                    funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                                <PopupDientesTemporarios
                                    propsShowTemporariosModal={this.state.showTemporariosModal} 
                                    funcionCloseTemporariosModal={this.closeTemporariosModal} 
                                    funcionCapturarTecla={this.capturarTecla}
                                    funcionRenderDientesTemporarios = {this.renderDientesTemporarios} 
                                    atributos = {this.state}/>

                        </Col>
                    </Row>

                    <Row>
                        <Col>
                                <Table id = "tablaVentas" striped bordered hover size="sm"  >
                                            <thead>
                                                <tr >
                                                <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" textAlign="center" placeholder="Año" name="filtroMoviPeriodoAnho" value = {this.state.filtroMoviPeriodoAnho} onChange={this.capturarTecla} />:null}</th>
                                                <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" textAlign="center" placeholder="Mes" name="filtroMoviPeriodoMes" value = {this.state.filtroMoviPeriodoMes} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" textAlign="center" placeholder="Nro.Fao" name="filtroMoviNumeroFao" value = {this.state.filtroMoviNumeroFao} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" textAlign="center" placeholder="Codigo" name="filtroMoviProductoCodigo" value = {this.state.filtroMoviProductoCodigo} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Procedimiento" name="filtroMoviProductoNombre" value = {this.state.filtroMoviProductoNombre} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Paciente" name="filtroMoviClienteNombre" value = {this.state.filtroMoviClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                                    {/* <th>Cant.</th> */}
                                                    <th>Descripcion</th>
                                                    <th>Arancel</th>
                                                    {/* <th style={{textAlign:"center"}}>Total</th> */}
                                                    <th style={{textAlign:"center"}}>Garantia</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Status" name="filtroMoviStatus" value = {this.state.filtroMoviStatus} onChange={this.capturarTecla} />:null}</th>
                                                    {/* <th style={{textAlign:"center"}}>Status</th> */}
                                                    <th style={{textAlign:"center"}}>Borrar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderListaMovimientos()}
                                                <tr>
                                                    {/* <td></td> */}
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td style={{textAlign:"right"}}>TOTALES</td>
                                                    <td style={{textAlign:"right"}}>Bruto:</td>
                                                    <td>{formatoFinal.format(this.state.sumatoriaBrutoFinal)}</td>
                                                    {/* <td>{this.sumatoria}</td> */}
                                                    <td style={{textAlign:"right", fontWeight: "bold"}}>Neto:</td>
                                                    <td style={{fontWeight: "bold"}}>{formatoFinal.format(this.state.sumatoriaNetoFinal)}</td>
                                                    <td></td>

                                                </tr>       
                                            </tbody>
                                </Table>
                        </Col>
                    </Row>
                    <ToastContainer />            
                </Form>
            </div>
        )
    }
}
export default  withRouter(ProductoVenta)
