import { useState, useEffect } from 'react';
// import { projectStorage, projectFirestore, timestamp } from '../firebase/config';
import { storage, db, timestamp} from '../config/firebase';

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => { // cada vez que file cambia en la linea 26 se ejecuta esta funcion 
    // references
    const storageRef = storage.ref(file.name);
    const collectionRef = db.collection('images');
    
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
    }, 
    (err) => {
      setError(err);
    }, 
    async () => {
      const url = await storageRef.getDownloadURL();
      const createdAt = timestamp();
      await collectionRef.add({ url, createdAt });
      setUrl(url);
    });
  }, [file]);  // file cambia y useeffect se ejecuta

  return { progress, url, error };
}

export default useStorage;