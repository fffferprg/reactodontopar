import React from "react";
import { Row, Col , Jumbotron, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ReactExport from "react-export-excel";
import { IconName, SiGooglesheets } from "react-icons/si";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


class InformeV4 extends React.Component {

render(){
    console.log('tipo de Movimiento =', this.props)

    return(
        // console.log(this.props.listaMovimientos)  como imprimir listaMovimientos???? *******************************
        // ************************************************************************************************************
        // <Row>
        // <Col md={12}>
        // console.log('tipo de movimiento: ', tipoMovimiento)
        // <ExcelFile element={<Button className="float-right" variant="info"  size="sm" >Exportar a Excel</Button>} >

        <ExcelFile element={
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Exportar a Excel</Tooltip>} > 
                       <SiGooglesheets className="float-right" size="25" color="#3b5998"/>
            </OverlayTrigger>
        }>  

        <ExcelSheet data={this.props.datos} name="Movimientos">

        <ExcelColumn label="Fecha" value="moviFecha"/>
        <ExcelColumn label="Nombre" value="moviClienteNombre"/>
        {/* <ExcelColumn label="Precio Compra" value="precioCompra"/>
        <ExcelColumn label="Cantidad" value="cantidad"/>
        <ExcelColumn label="Creado" value="creadoFormateado"/>
        <ExcelColumn label="Estado" value="estado"/> */}
        
          
        {/* {this.props.tipoMovimiento=='1'?<ExcelColumn label="Cantidad" value="cantidad"/>:
        this.props.tipoMovimiento=='2'?<ExcelColumn label="Cantidad" value="cantidad"/>:
        this.props.tipoMovimiento=='3'?<ExcelColumn label="Saldo" value="saldo"/>:null}

        {this.props.tipoMovimiento=='1'?<ExcelColumn label="Estado" value="estado"/>:
        this.props.tipoMovimiento=='2'?<ExcelColumn label="Estado" value="estado"/>:null}    */}

        {/* this.props.tipoMovimiento=='3'?<ExcelColumn label="Saldo" value="saldo"/>:null}          */}

        {/* {this.props.tipoMovimiento!='3'?<ExcelColumn label="Estado" value="estado"/>:null}
        {this.props.tipoMovimiento!='3'?<ExcelColumn label="Fecha" value="fecha"/>:null} */}
        
        {/* {this.props.tipoMovimiento=='3'?<ExcelColumn label="Creado" value="creado"/>:null}
        {this.props.tipoMovimiento=='3'?<ExcelColumn label="Saldo" value="saldo"/>:null} */}

        </ExcelSheet>
        </ExcelFile>
        // </Col>
        // </Row>
    )
    }
}

export default InformeV4;

        {/* // <ExcelFile element={
            <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Exportar a Excel</Tooltip>} > 
                       <SiGooglesheets className="float-right" size="26" color="#3b5998"/>
            </OverlayTrigger>
        }>  */}

                {/* if (tipoMovimiento == '1'){<ExcelColumn label="Precio Compra" value="precioCompra"/>}
        if (this.props.tipoMovimiento=='2'){<ExcelColumn label="Precio Venta" value="precioVenta"/>}  */}
