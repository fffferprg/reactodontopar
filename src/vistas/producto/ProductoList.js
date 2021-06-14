import React, { Component } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import {db} from '../../config/firebase';
import {Link} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';


class ProductoList extends Component {
    state={
        listaProductos : [

        ]
    }
    creaNuevoProducto = () => {
        // console.log('Nuevo producto');
        // console.log('Props del componente ProductoList: ', this.props)
        this.props.history.push('/productos/nuevo')
        
    }
    volver=()=>{
        this.props.history.goBack()
    }
    componentDidMount(){
        this.obtenerDatos()
    }
    confirmarAccion = (productoId) => {
        confirmAlert({
          title: 'Accion borrar',
          message: 'Esta seguro?.',
          buttons: [
            {
              label: 'Si',
              onClick: () => this.borrarProducto(productoId)
            },
            {
              label: 'No',
            //   onClick: () => alert('Click No')
            }
          ]
        });
      };
    obtenerDatos=()=>{
        let listaTemporal = []
        db.collection('productos').get()
        .then((snap)=>{
            snap.forEach((documento)=>{
                // console.log(documento.data())
                listaTemporal.push({
                    id : documento.id,
                    producto : documento.data().producto,
                    precioCompra : documento.data().precioCompra,
                    precioVenta : documento.data().precioVenta,

                })
            })

            this.setState({
                listaProductos : listaTemporal
            })
            // console.log(this.state)
            
         })
        .catch((error)=>{
            alert(error)
        })
    }
    borrarProducto =(productoId)=>{
        console.log(productoId)
        db.collection('productos').doc(`${productoId}`).delete()
        .then(()=>{
            this.obtenerDatos()
        })
    }
    renderItems = ()=> {
        return this.state.listaProductos.map((documento)=>{
            return(
                <tr key = {documento.id}> 
                    <td>{documento.producto}</td>
                    <td>{documento.precioCompra}</td>
                    <td>{documento.precioVenta}</td>
                    <td> <Link to={`/productos/editar/${documento.id}`}> Editar </Link> | <a href='#' onClick={()=>{this.confirmarAccion(documento.id)}}>Borrar</a> </td>
                    
                </tr>
            )
        })
    }
    render() {
        return (    
            <div>
               <Row style={{marginTop:"10px"}}> 
                   <Col><h2>Productos</h2></Col>
               </Row>
               <Row>
                   <Col>
                        <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            {/* <th>Código</th> */}
                                            <th>Producto</th>
                                            <th>Precio Compra</th>
                                            <th>Precio Venta</th>
                                             <th>Acciones</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderItems()}
                                       
                                    </tbody>
                                </Table>
                        </Col>
               </Row>
               <Row>
                   <Col>
                        <Button variant="primary" onClick={this.creaNuevoProducto} >Agregar Producto</Button> {' '}
                        <Button variant="danger" onClick={this.volver} >Volver</Button>
                   </Col>
               </Row>
            </div>

        )
                
            
        
    }
}


export default ProductoList;