import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { MdVisibility,MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext, MdFindReplace } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert';
import { ToastContainer, toast } from 'react-toastify';
import PopupDetalle from '../producto/PopupDetalle'
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';



class ProcedimientosLiberados extends Component {
    state={
        moviFechaProyectada :'',
        filtroMoviClienteNombre : '',
        mostrarFiltro : true,
        listaMovimientosModal: [],
        sumaTotal : 0,
        listaMovimientos: [],
        showDetalleModal: false,

    }
////////////////////////////////////     COMPONENTDIDMOUNT  ////////////////
    componentDidMount(){
        // this.obtenerMovimientos()
        // this.cargarStateSumatoriaFinal()
    }
////////////////////////////////////////////////////////////    CAPTURAR TECLA  ////////////////
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }
////////////////////////////////////////////////////////////    OBTENER MOVIMIENTOS  ///////////
    obtenerMovimientos = ()=>{
        let listaTemporal = []
        let listaTemporal2 = []
        let faoActual=''
        db.collection('movimientos').orderBy('moviNumeroFao')
        .onSnapshot((snap)=>{
            listaTemporal = []
            snap.forEach((documento)=>{
                let milisegundosDia = 24*60*60*1000
                let milisegundosTranscurridos = Math.abs(new Date(this.state.moviFechaProyectada).getTime()-new Date(documento.data().moviFechaFundacion).getTime())
                let diferenciaDias = Math.round(milisegundosTranscurridos/milisegundosDia)-1
                // console.log('diferenciaDias:',diferenciaDias)
                // console.log('moviClienteNombre:',documento.data().moviClienteNombre)
                // console.log('moviProductoGarantia:',documento.data().moviProductoGarantia)
                let garantia = documento.data().moviProductoGarantia
                // if(diferenciaDias<0){
                //     diferenciaDias=0
                // }
                // let mayor = diferenciaDias>Math.abs(documento.data().moviProductoGarantia)? true : false;
                // let resta = diferenciaDias-garantia
                let mayor = diferenciaDias>Math.abs(garantia)? true : false;
                // console.log('mayor:',mayor)
                // console.log('resta:',resta)
                if(mayor==true 
                    && documento.data().moviStatus!='historico'
                    && documento.data().moviProductoCodigo!='70010001'
                    && documento.data().moviProductoCodigo!='70070022'
                    ){
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
                        moviFechaFundacion : documento.data().moviFechaFundacion,
                        moviProductoGarantia : documento.data().moviProductoGarantia,
                    }
                    listaTemporal.push(movimientos) 
                    console.log('moviStatus:',documento.data().moviStatus)
                }
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
                    // moviPeriodoMes: listaTemporal[i-1].moviPeriodoMes,
                    // moviPeriodoAnho: listaTemporal[i-1].moviPeriodoAnho,
                    moviNumeroFao : listaTemporal[i-1].moviNumeroFao,
                    moviFechaFundacion : listaTemporal[i-1].moviFechaFundacion,
                }
                listaTemporal2.push(movimientosResumen)
                this.state.sumaTotal=0
            };
            this.setState({
                listaMovimientos : listaTemporal2.sort((a, b)=>{
                    return b.moviSumaTotal-a.moviSumaTotal;
                })
            })
        },(error)=>{
            alert(error)
            console.log(error)
        })
}
///////////////////////////////////////////////////////////     RENDER LISTA MOVIMIENTOS /////////////////
renderListaMovimientos = () => {
    var sumatoria = 0
    var neto = 0
    var porcentaje = 0
    const formatoTabla = new Intl.NumberFormat('de-DE')
    return this.state.listaMovimientos
    .filter((documento)=>{
        return (
        documento.moviClienteNombre.toLowerCase().indexOf(this.state.filtroMoviClienteNombre.toLowerCase())>=0)
        // && (documento.moviNumeroFao.toString().indexOf(this.state.filtroMoviNumeroFao)>=0)
        // && (documento.moviPeriodoAnho.toString().indexOf(this.state.filtroMoviPeriodoAnho)>=0)
        // && (documento.moviPeriodoMes.toString().indexOf(this.state.filtroMoviPeriodoMes)>=0)
    })
     
    .map((documento) => {
        // let fechaProyectada = moment(this.state.moviFechaProyectada)
        // let fechaFundacion = moment(documento.moviFechaFundacion)
        // let diferenciaDias = fechaProyectada.diff(fechaFundacion,'days')
        // let mayor = diferenciaDias>documento.moviProductoGarantia? true : false;
        // console.log('DIFERENCIA:',diferenciaDias, 'GARANTIA:',documento.moviProductoGarantia)
        // if(mayor == true){
            return (
                sumatoria = sumatoria + documento.moviSumaTotal,
                porcentaje = (sumatoria*25/100),
                neto = sumatoria - porcentaje,
                this.state.sumatoriaBrutoFinal = sumatoria,
                this.state.sumatoriaNetoFinal = neto,
                <tr key={documento.id} style={{lineHeight:"1.2"}}> 
                    <td style={{fontSize:"12px"}}>{documento.moviNumeroFao}</td>
                    <td style={{fontSize:"12px"}}>{documento.moviClienteNombre}</td>
                    <td style={{fontSize:"12px", textAlign:"center"}}>{documento.moviFechaFundacion}</td>
                    <td style={{fontSize:"12px", textAlign:"right"}}>{formatoTabla.format(documento.moviSumaTotal)}</td>
                    <td style={{textAlign:"center"}}> 
                        <div>
                            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Detalle</Tooltip>} > 
                                <MdVisibility size="19" onClick ={()=>this.openDetalleModal(documento.moviNumeroFao, documento.moviClienteNombre, documento.moviFechaFundacion)} />
                            </OverlayTrigger>
                            {' '}  
                        </div>
                    </td>
                </tr>
            )
        // }
    })
 }

 ////////////////////////////////////////////////////////////////////// MODAL DETALLE /////////////////////////////
openDetalleModal=(propMoviNumeroFao, propMoviClienteNombre, propMoviFechaFundacion)=>{
    // console.log('propMoviNumeroFao',propMoviNumeroFao)
    this.setState({
        detalleMoviNumeroFao : propMoviNumeroFao,
        detalleMoviClienteNombre : propMoviClienteNombre,
        detalleSumatoriaBrutoFinal : this.state.detalleSumatoriaBrutoFinal,
        detalleMoviFechaFundacion : propMoviFechaFundacion,
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
    // this.state.filtroMoviPeriodoAnho=this.state.periodoAnho
    // this.state.filtroMoviPeriodoMes=this.state.periodoMes
    // console.log('filtroMoviPeriodoAnho',this.state.filtroMoviPeriodoAnho)
    // console.log('filtroMoviPeriodoMes',this.state.filtroMoviPeriodoMes)
    // console.log('this.state.PeriodoAnho',this.state.PeriodoAnho)
    // console.log('this.state.PeriodoMes',this.state.PeriodoMes)
    // console.log('this.state.listaMovimientosModal',this.state.listaMovimientosModal)
    // console.log('detalleMoviNumeroFao',this.state.detalleMoviNumeroFao)

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
            // console.log('SUMATORIA FINAL:',this.state.sumatoriaBrutoFinal),
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


///////////////////////////////////////////////////////////     RENDER  /////////////////
render () {
    const formatoFinal = new Intl.NumberFormat('de-DE')
    return(
        <div>
            <Form>
                <Row style = {{textAlign : "center", backgroundColor:"#dbdbdb", paddingTop:5}}>
                        <Col md={12} sm = {12} xs = {12} ><h4>PROCEDIMIENTOS LIBERADOS</h4></Col>
                </Row>
                <Row>
                    <Col md={2} sm = {12} xs = {12}>
                        <Form.Group>
                            <Form.Label style={{fontSize:"14px"}}>Fecha proyectada *</Form.Label>
                            <Form.Control type="date" size="sm"  name="moviFechaProyectada" value = {this.state.moviFechaProyectada} onChange={this.capturarTecla} />
                        </Form.Group>    
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label style={{fontSize:"14px", paddingTop:42}}> </Form.Label>
                            <Button variant = "info" size="sm" onClick={() => {this.obtenerMovimientos()}}>Confirmar</Button>
                        </Form.Group>    
                    </Col>
                    {/* <Col md={2}>
                        <Form.Group>
                            <Form.Label style={{fontSize:"14px", paddingTop:42}}> </Form.Label>
                            <Button  style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                        </Form.Group>    
                    </Col> */}
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
                </Row>
                <Row>
                    <Col>
                                {/* style = {{backgroundColor:"#ADD8E6"}} */}
                        <Table id = "tablaLiberados" striped bordered hover size="sm"  >
                                <thead>
                                    <tr >                                    
                                        <th style={{textAlign:"left"}}>FAO</th>
                                        <th>{this.state.mostrarFiltro==true?<Form.Control size="sm" type="text" placeholder="Paciente" name="filtroMoviClienteNombre" value = {this.state.filtroMoviClienteNombre} onChange={this.capturarTecla} />:null}</th>
                                        <th style={{textAlign:"center"}}>Fecha</th>
                                        <th style={{textAlign:"right"}}>Valor</th>
                                        <th style={{textAlign:"center"}}>Ver</th>
                                    </tr>
                                </thead>
                                                <tbody>
                                                    {this.renderListaMovimientos()}
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={{textAlign:"right"}}>TOTAL:{this.state.total} {formatoFinal.format(this.state.sumatoriaBrutoFinal)}</td>
                                                        <td style={{fontWeight: "bold",textAlign:"center"}}>NETO:{this.state.neto}{formatoFinal.format(this.state.sumatoriaNetoFinal)}</td>
                                                        {/* <td style={{textAlign:"right", fontWeight: "bold"}}>Neto:</td> */}

                                                    </tr>       
                                                </tbody>
                                    </Table>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}
}
export default  withRouter(ProcedimientosLiberados)