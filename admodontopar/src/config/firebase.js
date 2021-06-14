import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var firebaseConfigDev = {
    apiKey: "AIzaSyAJd7m5uu-_vxWo4VT2E_iUaLVfRER3RwY",
    authDomain: "admorganizacion-8e7a6.firebaseapp.com",
    projectId: "admorganizacion-8e7a6",
    storageBucket: "admorganizacion-8e7a6.appspot.com",
    messagingSenderId: "962509838608",
    appId: "1:962509838608:web:fdfe87e80acfc07dc6ed95"
};

const firebaseConfigProd = {
    apiKey: "AIzaSyAtiAB3iF32dPgrtuougRlibESM_LIgGDs",
    authDomain: "loli-store.firebaseapp.com",
    databaseURL: "https://loli-store.firebaseio.com",
    projectId: "loli-store",
    storageBucket: "loli-store.appspot.com",
    messagingSenderId: "229617274498",
    appId: "1:229617274498:web:a62f34e114ceb5913c2e9b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfigDev);
  // firebase.initializeApp(firebaseConfigProd);
  export default firebase;
  export const admDb = firebase.firestore();
  export const admAuth = firebase.auth();
  export const admStorage = firebase.storage();