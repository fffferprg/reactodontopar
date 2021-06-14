import { storage } from '../config/firebase';
//pathToUpload: directorio donde se quiere almacenar el archivo
/*
Parametros
pathToUpload: directorio donde se quiere almacenar el archivo
fileToUpload: objeto del archivo que se quiere almacenar
progressFunction: metodo para obtener el progreso
completeFunction: metodo que se ejecuta cuando se termina de subir el archivo correctamente
*/
export const uploadFile = (pathToUpload, fileToUpload, progressFunction, completeFunction) => {
    const uploadTask = storage.ref(`${pathToUpload}/${fileToUpload.name}`).put(fileToUpload);
    uploadTask.on('state_changed', (snap) => {
    //Progress function
        const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        console.log('snap.bytesTransferred: ', snap.bytesTransferred );
        console.log('snap.totalBytes: ', snap.totalBytes)
        console.log(`${progress}%`)
        progressFunction(progress);
        }, (error) => {
        //Error function
        console.log('Error: ', error);
        }, () => {
        //Complete function
        storage.ref(`${pathToUpload}`).child(`${fileToUpload.name}`).getDownloadURL()
        .then((url) => {
        console.log('Upload complete: ', url)
        completeFunction(url);

    })

    })
}