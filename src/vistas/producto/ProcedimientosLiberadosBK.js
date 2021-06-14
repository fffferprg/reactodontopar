import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext, MdFindReplace, MdLineWeight } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import PopupProductos from './PopupProductos';
import PopupClientes from '../clientes/PopupClientes';
import Informe from '../../componentes/Informe';



class ProcedimientosLiberados extends Component {
    
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
        listaMovimientos: [],
        listaProductos: [],
        listaExcel:[],
        listaExcelTemporal:[],
        listaMovimientosExcel:[],
        movimientosFiltradosTemporal:[],
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
        moviPrecioVenta:0,
        moviClienteCarnetEmpleado:0,
        moviClienteEmpleadoNombre:'',
        moviProcedimientoDescripcion:'',
        moviProductoTotal:0,
        showProductoModal: false,
        showClienteModal: false,
        moviProductoGarantia:0,
        nuevaFecha:0,
    }


    componentDidMount(){
        this.obtenerMovimientos()
    }
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
            console.log('NACIMIENTO:',this.moviClienteFechaNacimiento)
        }

    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})
    }

    obtenerMovimientos = ()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('movimientos').orderBy('moviNumeroFao')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                let movimientos = {
                    id : documento.id,
                    moviClienteFechaNacimiento : documento.data().moviClienteFechaNacimiento, 
                    moviFecha : documento.data().moviFecha,
                    moviFechaFundacion: documento.data().moviFechaFundacion,
                    moviClienteCodigo : documento.data().moviClienteCodigo,
                    moviClienteNombre : documento.data().moviClienteNombre,
                    moviClienteTelefono : documento.data().moviClienteTelefono,
                    moviClienteCarnetEmpleado : documento.data().moviClienteCarnetEmpleado,
                    moviClienteEmpleadoNombre : documento.data().moviClienteEmpleadoNombre,
                    moviProductoCodigo : documento.data().moviProductoCodigo,
                    moviProductoNombre : documento.data().moviProductoNombre,
                    moviProductoCantidad : documento.data().moviProductoCantidad,
                    moviPrecioVenta : documento.data().moviPrecioVenta,
                    moviProcedimientoDescripcion : documento.data().moviProcedimientoDescripcion,
                    moviProductoTotal : documento.data().moviProductoTotal,
                    moviProductoGarantia : documento.data().moviProductoGarantia,

                    // creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                }
                listaTemporal.push(movimientos)
            })
            this.setState({
                listaMovimientos : listaTemporal.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
        },(error)=>{
            alert(error)
            console.log(error)
        })
        console.log('listaTemporal',listaTemporal)
        console.log('listaMovimientos',this.state.listaMovimientos)
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
        console.log(this.state.listaProductos)
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
        console.log(this.state.listaClientes)
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
                    moviClienteTelefono:documento.clienteTelefono, 
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

cargarListaExcel=(diasTranscurridos)=>{
        let excelMilisegundosDia = 24*60*60*1000
        this.state.listaExcelTemporal = this.state.listaMovimientos.filter(elemento =>{
        let excelMilisegundosTranscurridos = Math.abs(new Date(this.state.moviFecha)-new Date(elemento.moviFecha).getTime())
        let excelDiasTranscurridos = Math.round(excelMilisegundosTranscurridos/excelMilisegundosDia)-1

            return (excelDiasTranscurridos>elemento.moviProductoGarantia); })
 
    // this.setState({
    //     listaExcel : listaExcelTemporal
    // })
    console.log('LISTA EXCEL:',this.state.listaExcel)
    console.log('LISTA EXCEL TEMPORAL:',this.state.listaExcelTemporal)
    console.log('diasTranscurridos:',diasTranscurridos)
}

renderListaMovimientos = () => {
    let hoy = new Date()
    let milisegundosDia = 24*60*60*1000
    const formatoTabla = new Intl.NumberFormat('de-DE')
    let movimientosFiltradosTemporal = []
console.log('this.state.listaMovimientos',this.state.listaMovimientos)
    return this.state.listaMovimientos
    .filter((documento)=>{
        return (documento.moviClienteNombre.toLowerCase().indexOf(this.state.filtroMoviClienteNombre.toLowerCase())>=0)
        && (documento.moviFecha.toString().indexOf(this.state.filtroMoviFecha)>=0)
        && (documento.moviProductoCodigo.toString().indexOf(this.state.filtroMoviProductoCodigo)>=0)
        && (documento.moviProductoNombre.toLowerCase().indexOf(this.state.filtroMoviProductoNombre.toLowerCase())>=0)
    }) 
    .map((documento) => {
          let milisegundosTranscurridos = Math.abs(new Date(this.state.moviFecha).getTime()-new Date(documento.moviFechaFundacion).getTime())
          let diasTranscurridos = Math.round(milisegundosTranscurridos/milisegundosDia)-1
          let miliSegundosGarantia = (documento.moviProductoGarantia+2)*24*60*60*1000
          let miliSegundosProximaConsulta = new Date(documento.moviFechaFundacion).getTime() + miliSegundosGarantia
          let proximaConsulta = new Date(miliSegundosProximaConsulta).getFullYear()+'-'+(new Date(miliSegundosProximaConsulta).getMonth()+1)+'-'+new Date(miliSegundosProximaConsulta).getDate()
        console.log('this.state.moviFecha',new Date(this.state.moviFecha).getTime())
          console.log('MoviFecha:',new Date(documento.moviFecha).getTime(),'Garantia:',documento.moviProductoGarantia)
          console.log('milisegundosTranscurridos:',milisegundosTranscurridos)
          console.log('diasTranscurridos:',diasTranscurridos-1)
        console.log('PROXIMA CONSULTA:',new Date(proximaConsulta).toLocaleDateString())
        // console.log('PROXIMA CONSULTA:',proximaConsulta)

        if(diasTranscurridos>documento.moviProductoGarantia){
            return (
                this.state.movimientosFiltradosTemporal.push(documento),
                // this.state.listaExcel = movimientosFiltradosTemporal,
                console.log('movimientosFiltradosTemporal=',this.state.movimientosFiltradosTemporal),
                console.log('EXCEL=',this.state.listaExcel),
                console.log('ListaMovimientos:',this.state.listaMovimientos),
                // console.log('PROXIMA',proximaConsulta),

                // key es un identificador unico
                <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                    <td style={{fontSize:"12px"}}>{documento.moviFechaFundacion}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviProductoCodigo}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviProductoNombre}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviClienteNombre}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviClienteTelefono}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviProcedimientoDescripcion}</td>
                    {/* <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviPrecioVenta)}</td> */}
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoGarantia}</td>
                    {/* <td style={{fontSize:"12px", textAlign:"center"}}>{diasTranscurridos}</td> */}
                    <td style={{fontSize:"12px", textAlign:"center"}}>{proximaConsulta}</td>
                    <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviPrecioVenta)}</td>
                    <td style={{textAlign:"center"}}> 
                            <div>
                                <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Editar</Tooltip>} > 
                                    <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} />
                                </OverlayTrigger>
                                {' '}  
                                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Borrar</Tooltip>} > 
                                    <MdDeleteForever color="#3b5998" size="24" 
                                    onClick ={()=>this.confirmarAccion(documento.id)} 
                                    />
                                </OverlayTrigger>
                            </div>
                    </td>
                </tr>
            )
        }
    })
        // this.state.listaExcel = movimientosFiltradosTemporal
}

    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }

    cargarForm =(movimientoId)=>{
        console.log ("MovimientoId:",movimientoId)
        db.collection('movimientos').doc(`${movimientoId}`).get()
        .then((snap)=>{
          console.log(snap.data())
          this.setState({
            moviClienteFechaNacimiento : snap.data().moviClienteFechaNacimiento, 
            moviFecha : snap.data().moviFecha,
            moviClienteCodigo : snap.data().moviClienteCodigo,
            moviClienteNombre : snap.data().moviClienteNombre,
            moviClienteCarnetEmpleado : snap.data().moviClienteCarnetEmpleado,
            moviClienteEmpleadoNombre : snap.data().moviClienteEmpleadoNombre,
            moviProductoCodigo : snap.data().moviProductoCodigo,
            moviProductoNombre : snap.data().moviProductoNombre,
            moviProductoCantidad : snap.data().moviProductoCantidad,
            moviPrecioVenta : snap.data().moviPrecioVenta,
            moviProcedimientoDescripcion : snap.data().moviProcedimientoDescripcion,
            moviProductoTotal : snap.data().moviProductoTotal,
            moviClienteEditarId : snap.id,
            // fechaNumero : snap.data().moviFecha.replace(/-/g,''),
            fechaNumero : snap.data().moviFecha,
        })
          let hoy = new Date()
          let milisegundosDia = 24*60*60*1000
          let milisegundosTranscurridos = Math.abs(new Date()-new Date(this.state.fechaNumero).getTime())
          let diasTranscurridos = Math.round(milisegundosTranscurridos/milisegundosDia)
        //   let nuevaFecha = (this.state.moviFecha).date.getTime()

        //   console.log('NuevaFecha:',nuevaFecha)
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
        // <a className="whatsappMsg" href="https://api.whatsapp.com/send?phone=595991166470&text=PruebaWhat"></a>
      }

      borrarMovimiento = (movimientoId) =>{
        console.log(movimientoId)
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
            clienteNombre:'',
            clienteCodigo:0,
            clienteDocumento:0,
            clienteTelefono:0,
            mostrarFiltro:true,
            filtroMoviClienteNombre:'',
            filtroMoviProductoCodigo:'',
            filtroMoviProductoNombre:'',
            listaMovimientos: [],
            moviClienteEditarId:null,
            clienteEmail:'',
            moviClienteFechaNacimiento:'', 
            moviFecha:'',
            moviClienteCodigo:0,
            moviClienteNombre:'',
            moviClienteCarnetEmpleado:0,
            moviClienteEmpleadoNombre:'',
            moviProductoCodigo:'',
            moviProductoNombre:'',
            moviProductoCantidad:0,
            moviPrecioVenta:0,
            moviProcedimientoDescripcion:'',
            moviProductoTotal:0,
        })
        this.obtenerMovimientos()
    }

    guardar=()=>{
        console.log(this.state)
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

    render() {
        return (
            console.log('AQUII:',this.state.listaExcelTemporal),
            console.log('movimientosFiltradosTemporal:',this.movimientosFiltradosTemporal),
            console.log('TRANSCURRIDOS',this.diasTranscurridos),
            
            <div>
                 <Form>
                    {/* <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}>  */}
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>PROCEDIMIENTOS LIBERADOS</h4></Col>
                   
                    </Row>
                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label  style={{fontSize:"14px"}}>Fecha Proyectada</Form.Label>
                                <Form.Control type="date" size="sm"  name="moviFecha" value = {this.state.moviFecha} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                       
                        <Col md={4} sm = {12} xs = {12} >
                                {/* <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.renderListaMovimientos()}}>Filtrar</Button>{' '} */}
                                <Button style={{ marginTop:"30px", backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                                <Button style={{marginTop:"30px"}} variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                                <Informe datos = {this.state.movimientosFiltradosTemporal}/>
                                 
                                <PopupProductos 
                                    propsShowProductoModal={this.state.showProductoModal} 
                                    funcionCloseProductoModal={this.closeProductoModal} 
                                    funcionCapturarTecla={this.capturarTecla} 
                                    funcionGuardar={this.guardar}
                                    funcionCapturarPrecio={this.capturarPrecio}
                                    // listaProductos={this.state.listaProductos}
                                    funcionRenderListaProductos={this.renderListaProductos}
                                    funcionLimpiarCampos={this.limpiarCampos}
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
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                                <Table striped bordered hover size="sm" >
                                            <thead>
                                                <tr>
                                                    {/* <th>Producto</th> */}
                                                    {/* <th>Precio Compra</th> */}
                                                    <th >{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Fecha" name="filtroMoviFecha" value = {this.state.filtroMoviFecha} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Codigo" name="filtroMoviProductoCodigo" value = {this.state.filtroMoviProductoCodigo} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Procedimiento" name="filtroMoviProductoNombre" value = {this.state.filtroMoviProductoNombre} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Paciente" name="filtroMoviClienteNombre" value = {this.state.filtroMoviClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                                    <th>Telefono</th>
                                                    {/* <th>Fec.Nacimiento</th>
                                                    <th>Carnet</th>
                                                    <th>Empleado</th> */}
                                                    {/* <th>Cant.</th> */}
                                                    <th>Descripcion</th>
                                                    {/* <th>Arancel</th> */}
                                                    <th>Garantia</th>
                                                    {/* <th>Dias</th> */}
                                                    <th>Proxima</th>
                                                    <th>Total</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderListaMovimientos()}    
                                                {/* {this.cargarListaExcel(this.diasTranscurridos)}                                    */}
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
export default  withRouter(ProcedimientosLiberados)
