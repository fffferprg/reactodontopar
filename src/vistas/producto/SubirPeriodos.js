import React, { Component } from 'react'
import Datos from '../../assets/periodos.json'
import firebase, {db} from '../../config/firebase';
import moment from 'moment';
function SubirPeriodos() {
    
    return (

        <div className="SubirPeriodos">
            
            {Datos.map(documento =>{
                        // this.codigo=this.codigo++
                return(
                    db.collection('periodos').add({...documento, creado: moment().unix()}),
                    console.log(documento)
                )
            })}
                    <h1>LISTO</h1>
        </div>
    );
}
export default SubirPeriodos