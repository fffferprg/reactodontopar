import React from "react";
import { Row, Col , Jumbotron, Buttonm, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ReactExport from "react-export-excel";
import { IconName, SiGooglesheets } from "react-icons/si";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


/* [
    {label:'Producto', value:'producto' },
    {label:'Precio Compra', value:'precioCompra' },
    {label:'Precio Venta', value:'precioVenta' }
    ]*/



class InformeV2 extends React.Component {
    verProps =()=> {
        console.log('ProductoInforme props: ', this.props)
    }
    render(){
        this.verProps()
        return(
            <Row>
            <Col md={12}>
                <ExcelFile element={
                     <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Exportar a Excel</Tooltip>} > 
                        <SiGooglesheets className="float-right" size="25" color="#3b5998"/>
                     </OverlayTrigger>
                    }> 
                    {/* <ExcelFile element={<Button variant="primary" onClick={()=> this.verProps()}>Exportar a Excel</Button>} > */}
                    <ExcelSheet data={this.props.datos} name={this.props.nombreHoja}>
                        {
                            this.props.labels.map((elemento) => {
                                return <ExcelColumn label={elemento.label} value={elemento.value}/>
                            })
                        }
                        {/* <ExcelColumn label="Producto" value="producto"/>
                        <ExcelColumn label="Precio Compra" value="precioCompra"/>
                        <ExcelColumn label="Precio Venta" value="precioVenta"/> */}
                        {/* <ExcelColumn label="Creado" value="creado"/> */}
                        
                    </ExcelSheet>
                </ExcelFile>
            </Col>
        </Row>
        )
    }
}

export default InformeV2;