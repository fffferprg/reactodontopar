import React, { Component } from 'react'
import Datos from '../../assets/mov.json'
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
function SubirMovimientos() {
    
    return (

        <div className="SubirMovimientos">
            
            {Datos.map(documento =>{
                        // this.codigo=this.codigo++
                return(
                    db.collection('movimientos').add({...documento, 
                        moviPeriodoMes: '',
                        moviPeriodoAnho: '',
                        moviClienteCodigo: '',
                        moviClienteTelefono: '',
                        moviFecha: '',
                        moviPrecioVenta: '',
                        moviStatus: 'PRIMERA CARGA',
                        creado: moment().unix()}),
                    console.log(documento)
                )
            })}
                    <h1>LISTO</h1>
        </div>
    );
}
export default SubirMovimientos