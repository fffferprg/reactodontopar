import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'


var firebaseConfigDev = {
  apiKey: "AIzaSyCxZSHvpLwWlnVTDINbbEdo80oHHo4wOqc",
  authDomain: "devodontopar.firebaseapp.com",
  projectId: "devodontopar",
  storageBucket: "devodontopar.appspot.com",
  messagingSenderId: "672291778301",
  appId: "1:672291778301:web:d1a2a01909f0563ab41894"
};
// var firebaseConfigDev = {
//   apiKey: "AIzaSyA9AiYVOld58-IcqlfUQp7rEBfR6P52W7I",
//   authDomain: "microcrm-2365f.firebaseapp.com",
//   projectId: "microcrm-2365f",
//   storageBucket: "microcrm-2365f.appspot.com",
//   messagingSenderId: "69624294958",
//   appId: "1:69624294958:web:3a0cf331c745bdbdb0f9bf"
// };
var firebaseConfigPrd = {
  apiKey: "AIzaSyCe84hGKs-pHPohH5in_CO8ZdxJ3nglBeg",
  authDomain: "prdodontopar.firebaseapp.com",
  projectId: "prdodontopar",
  storageBucket: "prdodontopar.appspot.com",
  messagingSenderId: "73068124682",
  appId: "1:73068124682:web:366ba299c86719ac9b9df3"
};
// var firebaseConfigPrd = {
//   apiKey: "AIzaSyD_DWfH27KdD-kbaaHJpRl_4yiNijKdpCo",
//   authDomain: "prdlorena-1edd3.firebaseapp.com",
//   projectId: "prdlorena-1edd3",
//   storageBucket: "prdlorena-1edd3.appspot.com",
//   messagingSenderId: "567782726687",
//   appId: "1:567782726687:web:ecd084451b06f7e38ac92a"
// };

  // Initialize Firebase
  const proyectoSecundario = firebase.initializeApp(firebaseConfigDev, "secondary");
  // const proyectoSecundario = firebase.initializeApp(firebaseConfigPrd, "secondary");
  export const db = proyectoSecundario.firestore();
  // export const auth = firebase.auth();
  export const storage = proyectoSecundario.storage();
  