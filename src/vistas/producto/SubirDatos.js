import React, { Component } from 'react'
import Datos from '../../assets/nuevoArancel.json'
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
function SubirDatos() {
    return (
        <div className="SubirDatos">
            {Datos.map(documento =>{
                return(
                    db.collection('productos').add({...documento, creado: moment().unix()}),
                    // db.collection('productos').add({
                    //     cogido:documento.codigo.toString(),
                    //     productoNombre:documento.productoNombre,
                    //     precioVenta: documento.precioVenta,
                    //     productoGarantia: documento.productoGarantia,
                    //     creado : moment().unix(),
                    // }).then(function(docRef) {
                    //     console.log("Document written with ID: ", docRef.id);
                    // })
                    // .catch(function(error) {
                    //     console.error("Error adding document: ", error);
                    // }),
                    console.log(documento)
                )
            })}
                    <h1>LISTO</h1>
        </div>
    );
}
export default SubirDatos