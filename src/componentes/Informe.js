import React from "react";
import { Row, Col , Jumbotron, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ReactExport from "react-export-excel";
import { IconName, SiGooglesheets } from "react-icons/si";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class Informe extends React.Component {

render(){
    console.log('PROPS =', this.props)

    return(
        // console.log(this.props.listaMovimientos)  como imprimir listaMovimientos???? *******************************
        // ************************************************************************************************************
        // <Row>
        // <Col md={12}>
        // console.log('tipo de movimiento: ', tipoMovimiento)
        // <ExcelFile element={<Button className="float-right" variant="info"  size="sm" >Exportar a Excel</Button>} >

        <ExcelFile element={
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Exportar a Excel</Tooltip>} > 
                       <SiGooglesheets className="float-right" size="25" color="#3b5998" style={{marginTop:"30px" }} />
            </OverlayTrigger>
        }>  

        <ExcelSheet data={this.props.datos} name="Movimientos">

        <ExcelColumn label='Fecha' value='moviFecha'/>
        <ExcelColumn label='Codigo' value='moviProductoCodigo'/>
        <ExcelColumn label='Procedimiento' value='moviProductoNombre'/>
        <ExcelColumn label='Paciente' value='moviClienteNombre'/>
        <ExcelColumn label='Descripcion' value='moviProcedimientoDescripcion'/>
        <ExcelColumn label='Arancel' value='moviPrecioVenta'/>
        <ExcelColumn label='Garantia' value='moviProductoGarantia'/>
        {/* <ExcelColumn label='Dias' value=this.diasTranscurridos/> */}

        </ExcelSheet>
        </ExcelFile>
        // </Col>
        // </Row>
    )
    }
}

export default Informe;

        {/* // <ExcelFile element={
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Exportar a Excel</Tooltip>} > 
                       <SiGooglesheets className="float-right" size="26" color="#3b5998"/>
            </OverlayTrigger>
        }>  */}

                {/* if (tipoMovimiento == '1'){<ExcelColumn label="Precio Compra" value="precioCompra"/>}
        if (this.props.tipoMovimiento=='2'){<ExcelColumn label="Precio Venta" value="precioVenta"/>}  */}
