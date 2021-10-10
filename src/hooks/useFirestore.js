import { useState, useEffect } from 'react';
// import { projectFirestore } from '../firebase/config';
import {db} from '../config/firebase'

const useFirestore = (collection) => {
  // console.log('CODCLIENTE:',prosImagenClienteCodigo)
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    // const unsub = projectFirestore.collection(collection)
    const unsub = db.collection(collection)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          // console.log('COD CLIENTE:',doc.data().imagenClienteCodigo)
          // if(doc.data().imagenClienteCodigo == prosImagenClienteCodigo){
          documents.push({...doc.data(), id: doc.id});
        });
        setDocs(documents);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [collection]);
  // console.log('DOCUMENTOS:',docs)
  return { docs };
}

export default useFirestore;