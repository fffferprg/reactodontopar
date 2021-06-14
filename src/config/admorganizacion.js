import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfigAdmOrganizacion = {
  apiKey: "AIzaSyAJd7m5uu-_vxWo4VT2E_iUaLVfRER3RwY",
  authDomain: "admorganizacion-8e7a6.firebaseapp.com",
  projectId: "admorganizacion-8e7a6",
  storageBucket: "admorganizacion-8e7a6.appspot.com",
  messagingSenderId: "962509838608",
  appId: "1:962509838608:web:fdfe87e80acfc07dc6ed95"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfigAdmOrganizacion);
  export default firebase;
  export const db = firebase.firestore();
  export const auth = firebase.auth();
