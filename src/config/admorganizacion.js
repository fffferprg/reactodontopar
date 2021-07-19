import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

// var firebaseConfigAdmOrganizacion = {
//   apiKey: "AIzaSyAJd7m5uu-_vxWo4VT2E_iUaLVfRER3RwY",
//   authDomain: "admorganizacion-8e7a6.firebaseapp.com",
//   projectId: "admorganizacion-8e7a6",
//   storageBucket: "admorganizacion-8e7a6.appspot.com",
//   messagingSenderId: "962509838608",
//   appId: "1:962509838608:web:fdfe87e80acfc07dc6ed95"
// };
var firebaseConfigAdmOrganizacion = {
  apiKey: "AIzaSyDO7fD_x_3X0OiiQTkC17NNYdfjR-78AWQ",
  authDomain: "admorganizacion-11e3d.firebaseapp.com",
  projectId: "admorganizacion-11e3d",
  storageBucket: "admorganizacion-11e3d.appspot.com",
  messagingSenderId: "764536462266",
  appId: "1:764536462266:web:e1ae9bead295edec861b83"
}
  // Initialize Firebase
  firebase.initializeApp(firebaseConfigAdmOrganizacion);
  export default firebase;
  export const db = firebase.firestore();
  export const auth = firebase.auth();
