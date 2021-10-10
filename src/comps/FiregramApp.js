import React, { Component, useState, useEffect} from 'react';
import Title from '../comps/Title';
import UploadForm from '../comps/UploadForm';
import ImageGrid from '../comps/ImageGrid';
import Modal from '../comps/Modal';
import Test from '../comps/Test';
import useFirestore from '../hooks/useFirestore';

function FiregramApp(parametroCodigoCliente) {
  const [selectedImg, setSelectedImg] = useState(null);
  console.log('CLIENTE:',parametroCodigoCliente)
  // const { docs } = useFirestore('images', parametroCodigoCliente)
  // console.log('DOCS',docs)
  // if(parametroCodigoCliente!=''){

  // const { docs } = useFirestore('images')
  // console.log('DOCS:',docs)
  return (
    <div className="App">
      <UploadForm  propsCodigoCliente={parametroCodigoCliente}/>

      {/* <ImageGrid setSelectedImg={setSelectedImg} propsDocs={docs} />
      { selectedImg && (<Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} /> )} */}
      <ImageGrid setSelectedImg={setSelectedImg} 
      propsCodigoCliente={parametroCodigoCliente} />
      { selectedImg && (<Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} /> )}

    </div>

  );
// }
}

export default FiregramApp;