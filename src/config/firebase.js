import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var firebaseConfigDev = {
  apiKey: "AIzaSyA9AiYVOld58-IcqlfUQp7rEBfR6P52W7I",
  authDomain: "microcrm-2365f.firebaseapp.com",
  projectId: "microcrm-2365f",
  storageBucket: "microcrm-2365f.appspot.com",
  messagingSenderId: "69624294958",
  appId: "1:69624294958:web:3a0cf331c745bdbdb0f9bf"
};
var firebaseConfigPrd = {
  apiKey: "AIzaSyD_DWfH27KdD-kbaaHJpRl_4yiNijKdpCo",
  authDomain: "prdlorena-1edd3.firebaseapp.com",
  projectId: "prdlorena-1edd3",
  storageBucket: "prdlorena-1edd3.appspot.com",
  messagingSenderId: "567782726687",
  appId: "1:567782726687:web:ecd084451b06f7e38ac92a"
};

  // Initialize Firebase
  const proyectoSecundario = firebase.initializeApp(firebaseConfigDev, "secondary");
  // const proyectoSecundario = firebase.initializeApp(firebaseConfigPrd, "secondary");
  export const db = proyectoSecundario.firestore();
  // export const auth = firebase.auth();
  export const storage = proyectoSecundario.storage();