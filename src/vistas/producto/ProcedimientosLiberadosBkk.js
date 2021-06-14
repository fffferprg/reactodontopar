import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, Nav, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext, MdFindReplace, MdLineWeight } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import PopupProductos from './PopupProductos';
import PopupClientes from '../clientes/PopupClientes';
import InformeV4 from '../../componentes/InformeV4';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { LinkContainer } from 'react-router-bootstrap';





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
        console.log('LISTA MOVIMIENTOS:',this.state.listaMovimientos)
        console.log('STATES:',this.state)
    }
    obtenerMovimientos = ()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('movimientos').orderBy('creado')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                // if(diasTranscurridos>documento.moviProductoGarantia){
                    let movimientos = {
                        id : documento.id,
                        moviClienteFechaNacimiento : documento.data().moviClienteFechaNacimiento, 
                        moviFecha : documento.data().moviFecha,
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
                // }
                listaTemporal.push(movimientos)
            })
            this.setState({
                listaMovimientos : listaTemporal.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
        },(error)=>{
            alert(error)
            // console.log(error)
        })
        // this.renderListaMovimientos()  

}
    obtenerMovimientosFiltrados = ()=>{
        let hoy = new Date()
        let milisegundosDia = 24*60*60*1000
        let listaTemporal = []
        let movimientos = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        db.collection('movimientos').orderBy('creado')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                let milisegundosTranscurridos = Math.abs(new Date(this.state.moviFecha)-new Date(documento.moviFecha).getTime())
                let diasTranscurridos = Math.round(milisegundosTranscurridos/milisegundosDia)-1
                if(diasTranscurridos>documento.moviProductoGarantia){
                    let movimientos = {
                        id : documento.id,
                        moviClienteFechaNacimiento : documento.data().moviClienteFechaNacimiento, 
                        moviFecha : documento.data().moviFecha,
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
                }
                listaTemporal.push(movimientos)
            })
            this.setState({
                listaMovimientos : listaTemporal.reverse(),
                // metodoDesuscribirse : metodoDesuscribirse
            })
        },(error)=>{
            alert(error)
            // console.log(error)
        })
        // this.renderListaMovimientos()  

}

renderListaMovimientos = () => {
    // let hoy = new Date()
    // let milisegundosDia = 24*60*60*1000
    const formatoTabla = new Intl.NumberFormat('de-DE')

    return this.state.listaMovimientos
    .filter((documento)=>{
        return (documento.moviClienteNombre.toLowerCase().indexOf(this.state.filtroMoviClienteNombre.toLowerCase())>=0)
        && (documento.moviFecha.toString().indexOf(this.state.filtroMoviFecha)>=0)
        && (documento.moviProductoCodigo.toString().indexOf(this.state.filtroMoviProductoCodigo)>=0)
        && (documento.moviProductoNombre.toLowerCase().indexOf(this.state.filtroMoviProductoNombre.toLowerCase())>=0)
    }) 
    .map((documento) => {
        //   let milisegundosTranscurridos = Math.abs(new Date(this.state.moviFecha)-new Date(documento.moviFecha).getTime())
        //   let diasTranscurridos = Math.round(milisegundosTranscurridos/milisegundosDia)-1
        //   console.log('MoviFecha:',documento.moviFecha,'Garantia:',documento.moviProductoGarantia)
        //   console.log('milisegundosTranscurridos:',milisegundosTranscurridos)
        //   console.log('DIAS:',diasTranscurridos-1)
        // if(diasTranscurridos>documento.moviProductoGarantia){
            return (
                // key es un identificador unico
                <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                    <td style={{fontSize:"14px"}}>{documento.moviFecha}</td>
                    <td style={{fontSize:"14px"}}>{documento.moviProductoCodigo}</td>
                    <td style={{fontSize:"14px"}}>{documento.moviProductoNombre}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviClienteNombre}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviClienteTelefono}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviProcedimientoDescripcion}</td>
                    <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviPrecioVenta)}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviProductoGarantia}</td>
                    {/* <td style={{fontSize:"12px", textAlign:"center"}}>{diasTranscurridos}</td> */}
                    <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviProductoTotal)}</td>
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
        // }

    })
}

capturarTecla=(evento)=>{
    this.setState({[evento.target.name]:evento.target.value})
}
    render() {
        
        return (
            // console.log('AQUII:',this.state.listaExcelTemporal),
            
            <div>
                 <Form>
                    <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                         <Col md={12} sm = {12} xs = {12} ><h4>PROCEDIMIENTOS LIBERADOS</h4>
                        

                         </Col>
                   
                    </Row>
                    <Row>
                        <Col md={2} sm = {12} xs = {12}>
                            <Form.Group>
                                <Form.Label  style={{fontSize:"14px"}}>Fecha Proyectada</Form.Label>
                                <Form.Control type="date" size="sm"  name="moviFecha" value = {this.state.moviFecha} onChange={this.capturarTecla} />
                            </Form.Group>                        
                        </Col>
                       
                        <Col md={4} sm = {12} xs = {12} >
                                <Button style={{ marginTop:"30px", backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                                <Button style={{marginTop:"30px"}} variant = "info" size="sm" onClick={this.obtenerMovimientosFiltrados()}>Volver</Button>
                                {/* <InformeV4 datos = {this.state.listaMovimientos}/> */}


                                {/* <PopupProductos 
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
                                    atributos = {this.state}/> */}
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                                <Table id= "tablaProcedimientos" striped bordered hover size="sm" >
                                            <thead>
                                                <tr>
                                                    {/* <th>Producto</th> */}
                                                    {/* <th>Precio Compra</th> */}
                                                    <th >{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Fecha" name="filtroMoviFecha" value = {this.state.filtroMoviFecha} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Codigo" name="filtroMoviProductoCodigo" value = {this.state.filtroMoviProductoCodigo} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Procedimiento" name="filtroMoviProductoNombre" value = {this.state.filtroMoviProductoNombre} onChange={this.capturarTecla} />:null}</th>
                                                    <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Filtro Paciente" name="filtroMoviClienteNombre" value = {this.state.filtroMoviClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                                    <th>Telefono</th>
                                                    {/* <th>Fec.Nacimiento</th>
                                                    <th>Carnet</th>
                                                    <th>Empleado</th> */}
                                                    {/* <th>Cant.</th> */}
                                                    <th>Descripcion</th>
                                                    <th>Arancel</th>
                                                    <th>Garantia</th>
                                                    <th>Dias</th>
                                                    <th>Total</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {this.renderListaMovimientos()}     */}
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
