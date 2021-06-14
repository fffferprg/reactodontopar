import React, { Component } from 'react';
import { Row, Col, Form, Button, Table, OverlayTrigger, Tooltip, InputGroup, FormControl} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import Informe from '../../componentes/Informe';
import InformeV2 from '../../componentes/InformeV2';
import { MdDeleteForever, MdCreate, MdFindInPage, MdSkipPrevious, MdSkipNext, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IconName  } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import NumberFormat from 'react-number-format';


// import { IconName, FcDataSheet } from "react-icons/fc";



                    //  *************************STATES*********************

class ProductoForm extends Component {
    state={
        productoNombre:'',
        codigo:0,
        precioCompra:0,
        precioVenta:0,
        listaMovimientos: [],
        metodoDesuscribirse:null,
        productoEditarId: null,
        mostrarFiltro: false,// variable para mostrar y ocultar filtros 
        filtroCodigo:'',
        filtroProducto:'',
        ultimoProductoVisible:'',
        primerProductoVisible:'',
        buscador : ''
       
    }

    buscarProducto = () =>{
        let listaTemporal = []
           db.collection('productos').where('productoNombre','==',this.state.buscador).orderBy('creado')
           .limit(7)
            .get()
            .then (snap =>{
                listaTemporal = []
                snap.forEach((documento)=>{
                    let producto = {
                        id : documento.id,
                        productoNombre : documento.data().productoNombre,
                        precioCompra : documento.data().precioCompra,
                        precioVenta : documento.data().precioVenta,
                        codigo : documento.data().codigo,
                        // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                        creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                        saldo : documento.data().saldo
                    }
                    listaTemporal.push(producto)
                    console.log (producto)
                })
                //  console.log('Siguiente - Primer registro mostrado: ', snap.docs[0].data())
                 console.log('Siguiente - Ultimo registro mostrado: ', snap.docs[snap.docs.length-1].data());
                this.setState({
                    listaMovimientos : listaTemporal,
                    ultimoProductoVisible : snap.docs[snap.docs.length-1],
                    primerProductoVisible : snap.docs[0]
                    // metodoDesuscribirse : metodoDesuscribirse
                })
            })
            .catch(error =>{
                alert(error)
                console.log(error)
            })
    }

    filtrar = () =>{
        this.setState({mostrarFiltro:!this.state.mostrarFiltro})
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

                    //********************************************LUEGO DE MONTAR EL COMPONENTE *******************************
    componentDidMount(){
        this.obtenerProducto()
    }
                    //********************************************CARGAR PARA EDITAR *******************************

    cargarForm =(productoId)=>{
        console.log (productoId)
        db.collection('productos').doc(`${productoId}`).get()
        .then((snap)=>{
          console.log(snap.data())
          this.setState({
            productoNombre: snap.data().productoNombre,
            precioCompra: snap.data().precioCompra,
            precioVenta: snap.data().precioVenta,
            codigo : snap.data().codigo,
            productoEditarId : snap.id
          })
         })
        .catch((error)=>{
            alert(error)
        })
    }


    
                    //*********************************************RENDERIZA LISTA DE MOVIMMIENTOS *****************************
    renderListaMovimientos = () => {
        return this.state.listaMovimientos
        .filter((documento)=>{
            return (documento.productoNombre.toLowerCase().indexOf(this.state.filtroProducto.toLowerCase())>=0)
        }) 
        .map((documento, index) => {
            let indice = index + 1
            return (
                // key es un identificador unico
                <tr key={documento.id}> 
                    {/* <td>{indice}</td> */}
                    <td>{documento.productoNombre}</td>
                    <td style={{textAlign:"center"}}> <NumberFormat value={documento.precioCompra} displayType={'text'} thousandSeparator={true} /></td>
                    <td style={{textAlign:"center"}}> <NumberFormat value={documento.precioVenta} displayType={'text'} thousandSeparator={true} /></td>
                    <td style={{textAlign:"center"}}>{documento.creado}</td>
                    <td style={{textAlign:"center"}}>{documento.saldo}</td>
                    <td style={{textAlign:"center"}}>{documento.codigo}</td>
                    {/* <td> <a href = '#' onClick ={()=>this.cargarForm(documento.id)}> Editar </a> | <a href = '#' onClick ={()=>this.confirmarAccion(documento.id)}> Borrar </a> </td> */}
                    {/* FcEditImage */}
                    {/* <td> <FcEditImage size="24" onClick ={()=>this.cargarForm(documento.id)} /> <FcEmptyTrash size="24" onClick ={()=>this.confirmarAccion(documento.id)} /></td> */}
                    <td style={{textAlign:"center"}}> 
                        <div>
                            <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Editar</Tooltip>} > 
                                <MdCreate size="19" onClick ={()=>this.cargarForm(documento.id)} />
                            </OverlayTrigger>
                            {' '}  
                            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Borrar</Tooltip>} > 
                                <MdDeleteForever color="#3b5998" size="24" onClick ={()=>this.confirmarAccion(documento.id)} />
                            </OverlayTrigger>
                        </div>
                       
                    </td>
 
                    
                </tr>
            )
        })
    }
                    // *****************************************CAPTURA CARGA DE CAMPOS EN PANTALLA *************************
    capturarTecla=(evento)=>{
        this.setState({[evento.target.name]:evento.target.value})
    }
    capturarPrecio=(evento, name)=>{
        console.log('evento', evento)
        console.log('name', name)
        this.setState({[name]:evento.floatValue})

    }

                    //**************************************************GRABAR DATOS EN DB ***************************************
    guardar=()=>{
        // console.log(this.state)
        let datosMovimmientos = {
            productoNombre:this.state.productoNombre,
            precioCompra:this.state.precioCompra,
            precioVenta:this.state.precioVenta,
            codigo:this.state.codigo,
            
        }
        if(this.state.productoEditarId) {
                        
            db.collection('productos').doc(`${this.state.productoEditarId}`).update(datosMovimmientos)
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                alert('Editado correctamente')
                this.limpiarCampos()  
                this.obtenerProducto()  
            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
            // console.log(datosMovimmientos)       

        } else{
            //   console.log({...datosMovimmientos, creado: firebase.firestore.FieldValue.serverTimestamp()})                
            db.collection('productos').add({...datosMovimmientos, saldo : 0, creado: moment().unix()})
            .then(()=>{
                // se ejecuta cuando se inserto con exito
                // alert('Insertado correctamente')    
                toast.success('Insertado correctamente', {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
               this.limpiarCampos() 
               this.obtenerProducto()   

            })
            .catch((error)=>{
                // se ejecuta cuando sucede un error 
                alert(error)
            })
        }
        
        // console.log (datosMovimmientos)
    }
                    //******************************BORRAR PRODUCTO *************************************************
    borrarProducto = (productoId) =>{
        console.log(productoId)
        db.collection('productos').doc(productoId).delete()
        .then(()=>{
            // se ejecuta cuando se inserto con exito
            alert('Eliminado correctamente')   
            this.obtenerProducto() 

        })
        .catch((error)=>{
            // se ejecuta cuando sucede un error 
            alert(error)
        })
    }



                    //******************************CARGA MOVIMIENTOS EN LISTA TEMPORAL *************************************************
    obtenerProducto = ()=>{
            let listaTemporal = []
            // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
            // .onSnapshot((snap)=>{
            //    db.collection('productos').where('productoNombre','==','celular').orderBy('creado')
               db.collection('productos').orderBy('creado')
               .limit(7)
                .get()
                .then (snap =>{
                    listaTemporal = []
                    snap.forEach((documento)=>{
                        let producto = {
                            id : documento.id,
                            productoNombre : documento.data().productoNombre,
                            precioCompra : documento.data().precioCompra,
                            precioVenta : documento.data().precioVenta,
                            codigo : documento.data().codigo,
                            // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                            creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                            saldo : documento.data().saldo
                        }
                        listaTemporal.push(producto)
                        console.log (producto)
                    })
                    //  console.log('Siguiente - Primer registro mostrado: ', snap.docs[0].data())
                     console.log('Siguiente - Ultimo registro mostrado: ', snap.docs[snap.docs.length-1].data());
                    this.setState({
                        listaMovimientos : listaTemporal.reverse(),
                        ultimoProductoVisible : snap.docs[snap.docs.length-1],
                        primerProductoVisible : snap.docs[0]
                        // metodoDesuscribirse : metodoDesuscribirse
                    })
                })
                .catch(error =>{
                    alert(error)
                    console.log(error)
                })
    }
    paginaAnterior=()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        // .onSnapshot((snap)=>{
           db.collection('productos').orderBy('creado')
           .endBefore(this.state.primerProductoVisible)
           .limitToLast(7)
           .get()
           .then (snap =>{
               if (snap.docs[0]){
                listaTemporal = []
                snap.forEach((documento)=>{
                    let producto = {
                        id : documento.id,
                        productoNombre : documento.data().productoNombre,
                        precioCompra : documento.data().precioCompra,
                        precioVenta : documento.data().precioVenta,
                        codigo : documento.data().codigo,
                        // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                        creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                        saldo : documento.data().saldo
                    }
                    listaTemporal.push(producto)
                    console.log (producto)
                })
                //  console.log('Siguiente - Primer registro mostrado: ', snap.docs[0].data())
                 console.log('Siguiente - Ultimo registro mostrado: ', snap.docs[snap.docs.length-1].data());
                this.setState({
                    listaMovimientos : listaTemporal,
                    ultimoProductoVisible : snap.docs[snap.docs.length-1],
                    primerProductoVisible : snap.docs[0]

                    // metodoDesuscribirse : metodoDesuscribirse
                })
               }

            })
            .catch(error =>{
                alert(error)
                console.log(error)
            })     
    }
    siguientePagina=()=>{
        let listaTemporal = []
        // let metodoDesuscribirse = db.collection('productos').orderBy('creado')
        // .onSnapshot((snap)=>{
           db.collection('productos').orderBy('creado')
           .startAfter(this.state.ultimoProductoVisible)
           .limit(7)
           .get()
           .then (snap =>{
            if (snap.docs[0]){
                listaTemporal = []
                snap.forEach((documento)=>{
                    let producto = {
                        id : documento.id,
                        productoNombre : documento.data().productoNombre,
                        precioCompra : documento.data().precioCompra,
                        precioVenta : documento.data().precioVenta,
                        codigo : documento.data().codigo,
                        // creado: moment.unix(documento.data().creado.seconds).format("DD/MM/YYYY") || ''
                        creado : moment.unix(documento.data().creado).format("DD/MM/YYYY"),
                        saldo : documento.data().saldo
                    }
                    listaTemporal.push(producto)
                    console.log (producto)
                })
                //  console.log('Siguiente - Primer registro mostrado: ', snap.docs[0].data())
                 console.log('Siguiente - Ultimo registro mostrado: ', snap.docs[snap.docs.length-1].data());
                this.setState({
                    listaMovimientos : listaTemporal,
                    ultimoProductoVisible : snap.docs[snap.docs.length-1],
                    primerProductoVisible : snap.docs[0]

                    // metodoDesuscribirse : metodoDesuscribirse
                })
            }

            })
            .catch(error =>{
                alert(error)
                console.log(error)
            }) 
    }
                        // ************************************LIMPIAR CAMPOS******************************************************

    limpiarCampos=()=>{
        this.setState({
            productoNombre:'',
            precioCompra:0,
            precioVenta:0,
            codigo:0,
            productoEditarId: null,
            buscador:''
        })
    }

                    // ************************************ANTES DE DESMONTAR EL COMPONENTE******************************************************
    //  componentWillUnmount(){
    //      if (this.state.metodoDesuscribirse){
    //           this.state.metodoDesuscribirse()
    //      }}
    

                    // ************************************RENDERIZADO **************************************************************************
    render() {
        return (
            // *************************************** ESTO ES IGUAL A <div> *********************
            // <div style={{backgroundColor:"#3b5998"}}>      
            <div>      

                <Form>
                    <Row style={{marginRight:"0.1%",backgroundColor:"#dbdbdb", color:"#000",marginLeft:"0.1%", paddingTop:5, paddingLeft:"40%"}}> 
                      <Col ><h4>PRODUCTOS</h4></Col>
                    </Row>
                    <Row>
                    
                        <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Producto</Form.Label>
                                        <Form.Control type="text" size="sm"  name="productoNombre" value = {this.state.productoNombre}onChange={this.capturarTecla} />
                                    
                                    </Form.Group>
                        </Col> 
                        <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Precio Compra</Form.Label>
                                        {/* <Form.Control type="number"  size="sm" name="precioCompra" value = {this.state.precioCompra} onChange={this.capturarTecla} /> */}
                                        <NumberFormat style = {{borderColor:'#f3f3f3', backgroundColor:'#fff', width:'150px', borderRadius:"4px"}} 
                                        value={this.state.precioCompra} onValueChange ={(event)=>{this.capturarPrecio(event, "precioCompra" )}} thousandSeparator ={true} prefix={'G$'} />

                                    </Form.Group>
                        </Col>
                        <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Precio precioVenta</Form.Label>
                                        {/* <Form.Control type="number" size="sm"  name="precioVenta" value = {this.state.precioVenta} onChange={this.capturarTecla} /> */}
                                        <NumberFormat style = {{borderColor:'#f3f3f3', backgroundColor:'#fff', width:'150px', borderRadius:"4px"}} 
                                        value={this.state.precioVenta} onValueChange ={(event)=>{this.capturarPrecio(event, "precioVenta" )}} thousandSeparator ={true} prefix={'G$'} />

                                    </Form.Group>
                        </Col>
                        <Col md={1}>
                           <Form.Group>
                                <Form.Label>Código</Form.Label>
                                <Form.Control type="number"  size="sm" name="codigo" value = {this.state.codigo} onChange={this.capturarTecla} />
                               
                            </Form.Group>
                        </Col>
                    
                    </Row>
                                
                </Form>

                {/* //  *******************************************BOTONES***************************************** */}
                <Row>
                        <Col md={4} >
                            {/* <Form inline> */}
                                <Button style={{ backgroundColor:'#3b5998', borderColor:'#3b5998', color:'#fff'}} size="sm" onClick={() => {this.guardar()}}>Guardar</Button>{' '}
                                <Button style={{ backgroundColor:'#dedede', borderColor:'#dedede', color:'#000'}} size="sm"  onClick={this.limpiarCampos}>Limpiar Campos</Button>{' '}
                                <Button variant = "info" size="sm" onClick={() => {this.props.history.goBack()}}>Volver</Button>
                        </Col>
                        <Col  md={4}>
                            <Form inline>
                                    <InputGroup className="mb-2 mr-sm-2">
                                        <InputGroup.Prepend>
                                            <Form.Control size="sm" type="text" name="buscador" value={this.state.buscador} onChange={this.capturarTecla} placeholder="Filtrar producto"/>
                                        </InputGroup.Prepend>
                                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >filtrar</Tooltip>} > 
                                            <MdFindInPage color="#3b5998" size="30" onClick ={()=>this.buscarProducto()} />  
                                        </OverlayTrigger>

                                    </InputGroup>
                            </Form>
                        </Col>
                        <Col md={4}>
                        {/* FcDataSheet */}
                        {/* <Informe listaMovimientos = {this.state.listaMovimientos} />      */}
                        <InformeV2 labels = {
                            [
                                {label:'Producto', value:'productoNombre' },
                                {label:'Precio Compra', value:'precioCompra' },
                                {label:'Precio Venta', value:'precioVenta' },
                                {label:'Creado', value:'creado' },
                                {label:'Saldo', value:'saldo' }
                                ]
                        } datos = {this.state.listaMovimientos} nombreHoja = 'Productos' />     

                        </Col>
                        {/* <Row> */}
                </Row>
                {/* <br /> */}
   
                {/* <Row>

                    <Col md = {4}>
                        <Form inline>
                            <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
                                Username
                            </Form.Label>
                            <InputGroup className="mb-2 mr-sm-2">
                                <InputGroup.Prepend>
                                <InputGroup.Text>@</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl id="inlineFormInputGroupUsername2" placeholder="Username" />
                            </InputGroup>
                        </Form>

                            <Form>
                                <Form.Group>
                                    <Form.Control type="text" name="buscador" value={this.state.buscador} onChange={this.capturarTecla} placeholder="Nombre del producto"/>
                                </Form.Group>
                            </Form>
                            <Button variant="primary" onClick={this.buscarProducto} >Buscar</Button> {' '}

                    </Col>
                </Row> */}
 
                {/* <br/> */}
                {/* //  ********************************************TABLA****************************************** */}
                <Row>
                    <Col>
                            <Table responsive striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                {/* <th>Producto</th> */}
                                                {/* <th>Producto  {this.state.mostrarFiltro==true?<Form.Control type="text" size="sm" name="filtroProducto" value = {this.state.filtroProducto} onChange={this.capturarTecla} />:null}</th> */}
                                                {/* <th><Form.Control size="sm" type="text" name="buscador" value={this.state.buscador} onChange={this.capturarTecla} placeholder="Filtrar producto"/> */}
                                                {/* <MdFindInPage color="#3b5998" size="34" onClick ={()=>this.buscarProducto()} />  </th> */}
                                                <th style={{textAlign:"center"}}>Producto
                                                {/* <Form inline>
                                                    <InputGroup className="mb-2 mr-sm-2">
                                                        <InputGroup.Prepend>
                                                            <Form.Control size="sm" type="text" name="buscador" value={this.state.buscador} onChange={this.capturarTecla} placeholder="Filtrar producto"/>
                                                        </InputGroup.Prepend>
                                                        <MdFindInPage color="#3b5998" size="25" onClick ={()=>this.buscarProducto()} />  
                                                    </InputGroup>
                                                </Form> */}
                                                </th>
                                                <th style={{textAlign:"center"}}>Precio Compra</th>
                                                <th style={{textAlign:"center"}}>Precio Venta</th>
                                                <th style={{textAlign:"center"}}>Creado</th>
                                                <th style={{textAlign:"center"}}>Saldo</th>
                                                <th style={{textAlign:"center"}}>Codigo</th>
                                                {/* <th>Entradas</th>
                                                <th>Salidas</th>
                                                <th>Stock</th> */}
                                                <th style={{textAlign:"center"}}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderListaMovimientos()}                                       
                                        </tbody>
                            </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md = {6} >
                        <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Pagina anterior</Tooltip>} > 
                        {/* <MdSkipPrevious className="float-right" color="#3b5998" size="30" onClick ={()=>this.paginaAnterior()} />   */}
                        <MdNavigateBefore className="float-right" color="#3b5998" size="30" onClick ={()=>this.paginaAnterior()} />  
                        </OverlayTrigger>

                    </Col>
                    <Col md = {6} >
                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip" >Pagina siguiente</Tooltip>} > 
                            {/* <MdSkipNext className="float-left" color="#3b5998" size="30" onClick ={()=>this.siguientePagina()} />   */}
                            <MdNavigateNext className="float-left" color="#3b5998" size="30" onClick ={()=>this.siguientePagina()} />  
                        </OverlayTrigger>

                    </Col>
                </Row>
              
                <ToastContainer />

                
            </div>
        )
    }
}

export default withRouter(ProductoForm)

