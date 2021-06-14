import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdVisibility,MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext, MdFindReplace } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import PopupPeriodos from './PopupPeriodos';
import PopupProductos from './PopupProductos';
import PopupClientes from '../clientes/PopupClientes';
import NumberFormat from 'react-number-format';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import PopupDetalle from '../producto/PopupDetalle'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

class ProductoProduccion extends Component {
    state={
        fechaNumero:'',
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
        filtroMoviFecha:'',
        filtroMoviPeriodoAnho:'',
        filtroMoviPeriodoMes:'',
        filtroPeriodoAnho:'',
        filtroPeriodoMes:'',
        filtroMoviNumeroFao:'',
        listaMovimientos: [],
        listaMovimientosModal: [],
        listaProductos: [],
        listaClientes: [],
        moviClienteEditarId:null,
        clienteEmail:'',
        moviClienteFechaNacimiento:'', 
        // moviFecha:new Date().format("DD/MM/YYYY"),
        moviFecha:'',
        moviClienteCodigo:0,
        moviClienteNombre:'',
        moviClienteCarnetEmpleado:0,
        moviClienteEmpleadoNombre:'',
        moviProductoCodigo:'',
        moviProductoNombre:'',
        moviProductoCantidad:0,
        moviProductoGarantia:0,
        moviPrecioVenta:0,
        moviClienteCarnetEmpleado:0,
        moviClienteEmpleadoNombre:'',
        moviProcedimientoDescripcion:'',
        moviProductoTotal:0,
        showProductoModal: false,
        showClienteModal: false,
        showDetalleModal: false,
        sumaTotal:0,
        sumatoriaBrutoFinal:0,
        detalleSumatoriaBrutoFinal:0,
        sumatoriaNetoFinal:0,
        moviPeriodo:'',
        periodoAnho:'',
        periodoMes:'',
        listaPeriodos:[],
        neto:'NETO:    ',
        total:'Bruto:    ',

    }


    componentDidMount(){
        this.obtenerMovimientos()
        // this.obtenerProductos()
        // this.obtenerClientes()
        this.cargarStateSumatoriaFinal()
        this.obtenerPeriodos()
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
    // console.log('this.state.filtroPeriodoAnho',this.state.filtroPeriodoAnho)
    // console.log('this.state.filtroPeriodoMes',this.state.filtroPeriodoMes)

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
//////////////////
///////////////////////// MODAL DETALLE /////////////////////////////
openDetalleModal=(propMoviNumeroFao, propMoviClienteNombre)=>{
    console.log('propMoviNumeroFao',propMoviNumeroFao)
    this.setState({
        detalleMoviNumeroFao : propMoviNumeroFao,
        detalleMoviClienteNombre : propMoviClienteNombre,
        detalleSumatoriaBrutoFinal : this.state.detalleSumatoriaBrutoFinal,
      showDetalleModal: true,
    })
    }

closeDetalleModal=()=>{
      this.setState({
        showDetalleModal: false
      }) 
    }    

renderDetalle=()=>{
    var sumatoria = 0
    var neto = 0
    var porcentaje = 0
    const formatoTabla = new Intl.NumberFormat('de-DE')
    this.state.filtroMoviPeriodoAnho=this.state.periodoAnho
    this.state.filtroMoviPeriodoMes=this.state.periodoMes
    // console.log('filtroMoviPeriodoAnho',this.state.filtroMoviPeriodoAnho)
    // console.log('filtroMoviPeriodoMes',this.state.filtroMoviPeriodoMes)
    // console.log('this.state.PeriodoAnho',this.state.PeriodoAnho)
    // console.log('this.state.PeriodoMes',this.state.PeriodoMes)
    console.log('this.state.listaMovimientosModal',this.state.listaMovimientosModal)
    console.log('detalleMoviNumeroFao',this.state.detalleMoviNumeroFao)

    return this.state.listaMovimientosModal
    .map((documento) => {
        // sumatoria = sumatoria+parseInt(documento.moviProductoTotal)
        if(documento.moviNumeroFao==this.state.detalleMoviNumeroFao){
        return (
            // key es un identificador unico
            sumatoria = sumatoria + documento.moviProductoTotal,
            porcentaje = (sumatoria*25/100),
            neto = sumatoria - porcentaje,
            this.state.detalleSumatoriaBrutoFinal = sumatoria,
            this.state.sumatoriaNetoFinal = neto,
            // console.log('SUMATORIA TEMPORAL:',sumatoria), 
            console.log('SUMATORIA FINAL:',this.state.sumatoriaBrutoFinal),
            <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                <td style={{fontSize:"12px"}}>{documento.moviProductoCodigo}</td>
                <td style={{fontSize:"12px"}}>{documento.moviProductoNombre}</td>
                <td style={{fontSize:"12px"}}>{documento.moviProcedimientoDescripcion}</td>
                <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviProductoTotal)}</td>
            </tr>
        )
    }
    })
}
///////////////////////// MODAL PRODUCTO /////////////////////////////

    openProductoModal=()=>{
        this.setState({
          showProductoModal: true
        })
        }

    closeProductoModal=()=>{
          this.setState({
            showProductoModal: false
          }) 
        }    

    openClienteModal=()=>{
        this.setState({
            showClienteModal: true
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
        let listaTemporal2 = []
        let faoActual=''
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('movimientos').orderBy('moviNumeroFao')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                        // this.state.sumaTotal=this.state.sumaTotal+documento.precioVenta
                        let movimientos = {
                            id : documento.id,
                            moviClienteNombre : documento.data().moviClienteNombre,
                            moviProductoTotal : documento.data().moviProductoTotal,
                            moviPeriodoMes: documento.data().moviPeriodoMes,
                            moviPeriodoAnho: documento.data().moviPeriodoAnho,
                            moviNumeroFao : documento.data().moviNumeroFao,
                            moviProductoCodigo : documento.data().moviProductoCodigo,
                            moviProductoNombre : documento.data().moviProductoNombre,
                            moviProcedimientoDescripcion : documento.data().moviProcedimientoDescripcion,

                        }
                        listaTemporal.push(movimientos)
            })
            // console.log(listaTemporal[0].moviNumeroFao)
            this.state.listaMovimientosModal = listaTemporal
            let i=0
            let faoActual=''
            while(i<listaTemporal.length){
                this.faoActual=listaTemporal[i].moviNumeroFao
                // console.log('faoActual',this.faoActual)
                // console.log('i',i)
                while(i<listaTemporal.length && this.faoActual==listaTemporal[i].moviNumeroFao){
                    this.state.sumaTotal=this.state.sumaTotal+listaTemporal[i].moviProductoTotal
                    i++
                }
                // console.log('sumaTotal',this.state.sumaTotal)
                // console.log('NOMBRE',listaTemporal[i-1].moviClienteNombre)
                let movimientosResumen = {
                    id : listaTemporal[i-1].id,
                    moviClienteNombre : listaTemporal[i-1].moviClienteNombre,
                    moviSumaTotal : this.state.sumaTotal,
                    moviPeriodoMes: listaTemporal[i-1].moviPeriodoMes,
                    moviPeriodoAnho: listaTemporal[i-1].moviPeriodoAnho,
                    moviNumeroFao : listaTemporal[i-1].moviNumeroFao,
                }
                listaTemporal2.push(movimientosResumen)
                this.state.sumaTotal=0
            }

            this.setState({
                listaMovimientos : listaTemporal2.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
        },(error)=>{
            alert(error)
            console.log(error)
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
        // console.log(this.state.listaProductos)
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
                    showProductoModal: false })}}>
                    SELECCIONAR
                    </a></td>
            </tr>
        )
    })
}

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
                <td><a href="#" onClick={()=>{this.setState({
                    clienteSeleccionado:documento, 
                    moviClienteCodigo:documento.clienteCodigo, 
                    moviClienteNombre:documento.clienteNombre, 
                    moviClienteCarnetEmpleado:documento.clienteCarnetEmpleado,
                    moviClienteEmpleadoNombre:documento.clienteEmpleadoNombre, 
                    moviClienteFechaNacimiento:documento.clienteFechaNacimiento,
                    showClienteModal: false })}}>
                    SELECCIONAR
                    </a></td>
            </tr>
        )
    })
}

renderListaMovimientos = () => {
    var sumatoria = 0
    var neto = 0
    var porcentaje = 0
    const formatoTabla = new Intl.NumberFormat('de-DE')
    this.state.filtroMoviPeriodoAnho=this.state.periodoAnho
    this.state.filtroMoviPeriodoMes=this.state.periodoMes
    // console.log('filtroMoviPeriodoAnho',this.state.filtroMoviPeriodoAnho)
    // console.log('filtroMoviPeriodoMes',this.state.filtroMoviPeriodoMes)
    // console.log('this.state.PeriodoAnho',this.state.PeriodoAnho)
    // console.log('this.state.PeriodoMes',this.state.PeriodoMes)

    return this.state.listaMovimientos
    .filter((documento)=>{
        return (documento.moviClienteNombre.toLowerCase().indexOf(this.state.filtroMoviClienteNombre.toLowerCase())>=0)
        && (documento.moviNumeroFao.toString().indexOf(this.state.filtroMoviNumeroFao)>=0)
        && (documento.moviPeriodoAnho.toString().indexOf(this.state.filtroMoviPeriodoAnho)>=0)
        && (documento.moviPeriodoMes.toString().indexOf(this.state.filtroMoviPeriodoMes)>=0)
        // && (documento.moviProductoNombre.toLowerCase().indexOf(this.state.filtroMoviProductoNombre.toLowerCase())>=0)

    }) 
    .map((documento) => {
        // sumatoria = sumatoria+parseInt(documento.moviProductoTotal)

        return (
            // key es un identificador unico
            sumatoria = sumatoria + documento.moviSumaTotal,
            porcentaje = (sumatoria*25/100),
            neto = sumatoria - porcentaje,
            this.state.sumatoriaBrutoFinal = sumatoria,
            this.state.sumatoriaNetoFinal = neto,
            // console.log('SUMATORIA TEMPORAL:',sumatoria), 
            // console.log('SUMATORIA FINAL:',this.state.sumatoriaFinal),
     
            <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                {/* <td style={{fontSize:"12px"}}>{documento.moviFecha}</td> */}
                <td style={{fontSize:"12px"}}>{documento.moviPeriodoAnho}</td>
                <td style={{fontSize:"12px"}}>{documento.moviPeriodoMes}</td>
                <td style={{fontSize:"12px"}}>{documento.moviNumeroFao}</td>
                <td style={{fontSize:"12px"}}>{documento.moviClienteNombre}</td>
                {/* <td style={{fontSize:"12px"}}>{documento.moviProductoNombre}</td> */}
                {/* <td style={{fontSize:"12px"}}><a href="#" onClick={()=>{
                    this.openPeriodoModal}}>{documento.moviClienteNombre}</a></td>  */}
                {/* <td style={{fontSize:"12px"}}>{documento.moviProcedimientoDescripcion}</td> */}
                <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviSumaTotal)}</td>
                {/* <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoCantidad}</td> */}
                {/* <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviProductoTotal)}</td> */}
                {/* <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoGarantia}</td> */}
                <td style={{textAlign:"center"}}> 
                        <div>
                            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Detalle</Tooltip>} > 
                                <MdVisibility size="19" onClick ={()=>this.openDetalleModal(documento.moviNumeroFao, documento.moviClienteNombre, this.state.sumatoriaBrutoFinal)} />
                            </OverlayTrigger>
                            {' '}  
                            {/* <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Borrar</Tooltip>} > 
                                <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} />
                            </OverlayTrigger> */}
                        </div>
    
                </td>
            </tr>

        )
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
            moviClienteFechaNacimiento : snap.data().moviClienteFechaNacimiento, 
            moviFecha : snap.data().moviFecha,
            moviClienteCodigo : snap.data().moviClienteCodigo,
            moviClienteNombre : snap.data().moviClienteNombre,
            moviClienteCarnetEmpleado : snap.data().moviClienteCarnetEmpleado,
            moviClienteEmpleadoNombre : snap.data().moviClienteEmpleadoNombre,
            moviProductoCodigo : snap.data().moviProductoCodigo,
            moviProductoNombre : snap.data().moviProductoNombre,
            moviProductoGarantia : snap.data().moviProductoGarantia,
            moviProductoCantidad : snap.data().moviProductoCantidad,
            moviPrecioVenta : snap.data().moviPrecioVenta,
            moviProcedimientoDescripcion : snap.data().moviProcedimientoDescripcion,
            moviProductoTotal : snap.data().moviProductoTotal,
            moviClienteEditarId : snap.id,
            fechaNumero : snap.data().moviFecha.replace(/-/g,''),
          })
          let sumar = parseInt(this.state.fechaNumero)+1
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
        fechaNumero:'',
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
        filtroMoviFecha:'',
        filtroMoviPeriodoAnho:'',
        filtroMoviPeriodoMes:'',
        listaMovimientos: [],
        listaProductos: [],
        listaClientes: [],
        moviClienteEditarId:null,
        clienteEmail:'',
        moviClienteFechaNacimiento:'', 
        // moviFecha:new Date().format("DD/MM/YYYY"),
        moviFecha:'',
        moviClienteCodigo:0,
        moviClienteNombre:'',
        moviClienteCarnetEmpleado:0,
        moviClienteEmpleadoNombre:'',
        moviProductoCodigo:'',
        moviProductoNombre:'',
        moviProductoCantidad:0,
        moviProductoGarantia:0,
        moviPrecioVenta:0,
        moviClienteCarnetEmpleado:0,
        moviClienteEmpleadoNombre:'',
        moviProcedimientoDescripcion:'',
        moviProductoTotal:0,
        showProductoModal: false,
        showClienteModal: false,
        sumaTotal:0,
        sumatoriaBrutoFinal:0,
        sumatoriaNetoFinal:0,
        moviPeriodo:'',
        periodoAnho:'',
        periodoMes:'',
        // listaPeriodos:[],
        })
        this.obtenerMovimientos()
    }

    guardar=()=>{
        // console.log(this.state)
        // console.log(productoTemporal)
        let datosMovimmientos = {
            moviClienteFechaNacimiento : this.state.moviClienteFechaNacimiento, 
            moviFecha : this.state.moviFecha,
            moviClienteCodigo : this.state.moviClienteCodigo,
            moviClienteNombre : this.state.moviClienteNombre,
            moviClienteCarnetEmpleado : this.state.moviClienteCarnetEmpleado,
            moviClienteEmpleadoNombre : this.state.moviClienteEmpleadoNombre,
            moviProductoCodigo : this.state.moviProductoCodigo,
            moviProductoNombre : this.state.moviProductoNombre,
            moviProductoGarantia: this.state.moviProductoGarantia,
            moviProductoCantidad : this.state.moviProductoCantidad,
            moviPrecioVenta : this.state.moviPrecioVenta,
            moviProcedimientoDescripcion : this.state.moviProcedimientoDescripcion,
            moviProductoTotal: this.state.moviProductoCantidad * this.state.moviPrecioVenta,
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
                                      // PARA GUARDAR
            if(this.state.moviFecha!='' 
            && this.state.moviClienteCodigo!=0 
            && this.state.moviProductoCodigo!=0
            && this.state.moviProductoCantidad!=0
            && this.state.moviProcedimientoDescripcion!=''){    
                db.collection('movimientos').add({
                    ...datosMovimmientos, 
                    creado : moment().unix(),
                })
                .then(()=>{
                    // console.log (datosMovimmientos)
                    // console.log(this.state.productoSeleccionado.Id)
                //     db.collection('productos').doc(this.state.productoSeleccionado.id).update({
                //     saldo : this.state.productoSeleccionado.saldo - parseInt(this.state.cantidad)
                //     })
                // .catch((error)=>{
                        // aqui hay que borrar en caso de que falle actualizacion de saldo en stock
                // })
                    // se ejecuta cuando se inserto con exito
                    // alert('Insertado correctamente') 
                    this.limpiarCampos()  
                    this.obtenerMovimientos()   
                    toast.success('Insertado correctamente', {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });


                    // this.closeModal()
                })
                .catch((error)=>{
                    // se ejecuta cuando sucede un error 
                    // alert(error)
                    console.log(error)
                })
            }else {
                alert('Los campos con * son obligatorios')  
            }
            // console.log (datosMovimmientos)
        }    
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
        const formatoFinal = new Intl.NumberFormat('de-DE')
        return (
            
            <div>
                 <Form>
                    {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}>  */}
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>PRODUCCION</h4></Col>
                   
                    </Row>

                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>Periodo *</Form.Label>
                                <Form.Control type="text" size="sm"  name="moviPeriodo" value = {this.state.moviPeriodo} onChange={this.capturarTecla} onClick={this.openPeriodoModal} />
                            </Form.Group>    
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px", paddingTop:42}}> </Form.Label>
                                <Button  style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                            </Form.Group>    
                        </Col>
                        {/* <Col md={2} style={{fontWeight: "bold",paddingTop:32}}>{this.state.total} {formatoFinal.format(this.state.sumatoriaBrutoFinal)}
                        </Col>
                        <Col md={2} style={{fontWeight: "bold",paddingTop:32}}>{this.state.neto}{formatoFinal.format(this.state.sumatoriaNetoFinal)}
                        </Col> */}
                        <PopupPeriodos
                                    propsShowPeriodoModal={this.state.showPeriodoModal} 
                                    funcionClosePeriodoModal={this.closePeriodoModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionGuardar={this.guardar}
                                    funcionRenderListaPeriodos={this.renderListaPeriodos}
                                    funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                        <PopupDetalle
                                    propsShowDetalleModal={this.state.showDetalleModal} 
                                    // propsMoviNumeroFao={this.state.MoviNumeroFao}
                                    // propsMoviClienteNombre={this.state.moviClienteNombre}
                                    propsSumatoriaBrutoFinal={this.state.sumatoriaBrutoFinal}
                                    funcionCloseDetalleModal={this.closeDetalleModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    // funcionGuardar={this.guardar}
                                    funcionRenderDetalle={this.renderDetalle}
                                    // funcionLimpiarCampos={this.limpiarCampos}
                                    atributos = {this.state}/>
                        

                        {/* <Col md={2} sm = {6} xs = {6}>
                            <Form.Group>
                                <Form.Label style={{fontSize:"14px"}}>FECHA PROYECTADA </Form.Label>
                                <Form.Control type="text" size="sm"  placeholder="ej: 2021-01 = enero/21" name="filtroMoviFecha" value = {this.state.filtroMoviFecha} onChange={this.capturarTecla}  />
                            </Form.Group>                        
                        </Col>  */}
                    </Row>    

                    
                    <Row>
                        <Col>
                                <Table id = "tablaVentas" striped bordered hover size="sm" style = {{backgroundColor:"#ADD8E6"}} >
                                            <thead>
                                                <tr >
                                                    {/* <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" textAlign="center" placeholder="Fecha" name="filtroMoviFecha" value = {this.state.filtroMoviFecha} onChange={this.capturarTecla} />:null}</th> */}
                                                    {/* <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Año" name="filtroMoviPeriodoAnho" value = {this.state.filtroMoviPeriodoAnho} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Mes" name="filtroMoviPeriodoMes" value = {this.state.filtroMoviPeriodoMes} onChange={this.capturarTecla} />:null}</th> */}
                                                    <th style={{textAlign:"center"}}>Año</th>
                                                    <th style={{textAlign:"center"}}>Mes</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="FAO" name="filtroMoviNumeroFao" value = {this.state.filtroMoviNumeroFao} onChange={this.capturarTecla} />:null}</th>
                                                    {/* <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Procedimiento" name="filtroMoviProductoNombre" value = {this.state.filtroMoviProductoNombre} onChange={this.capturarTecla} />:null}</th> */}
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Paciente" name="filtroMoviClienteNombre" value = {this.state.filtroMoviClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                                    {/* <th>Descripcion</th> */}
                                                    <th style={{textAlign:"right"}}>Valor</th>
                                                    <th style={{textAlign:"center"}}>Ver</th>
                                                    {/* <th>Cant.</th> */}
                                                    {/* <th style={{textAlign:"center"}}>Total</th> */}
                                                    {/* <th style={{textAlign:"center"}}>Garantia</th> */}
                                                    {/* <th style={{textAlign:"center"}}>Acciones</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderListaMovimientos()}
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    {/* <td></td> */}
                                                    <td></td>
                                                    {/* <td></td> */}
                                                    {/* <td style={{textAlign:"right"}}></td> */}
                                                    {/* <td style={{textAlign:"right"}}>Bruto:</td> */}
                                                    <td></td>
                                                    <td style={{textAlign:"right"}}>{this.state.total} {formatoFinal.format(this.state.sumatoriaBrutoFinal)}</td>
                                                    <td style={{fontWeight: "bold",textAlign:"center"}}>{this.state.neto}{formatoFinal.format(this.state.sumatoriaNetoFinal)}</td>
                                                    {/* <td style={{textAlign:"right", fontWeight: "bold"}}>Neto:</td> */}

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
export default  withRouter(ProductoProduccion)
