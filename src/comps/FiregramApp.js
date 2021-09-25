import React, { useState } from 'react';
import Title from '../comps/Title';
import UploadForm from '../comps/UploadForm';
import ImageGrid from '../comps/ImageGrid';
import Modal from '../comps/Modal';
import Test from '../comps/Test';

function FiregramApp() {
  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <div className="App">
      {/* <Title/> */}
      <UploadForm />
      {/* <Test/> */}
      <ImageGrid setSelectedImg={setSelectedImg} />
      { selectedImg && (
        <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
      )}
    </div>
  );
}

export default FiregramApp;