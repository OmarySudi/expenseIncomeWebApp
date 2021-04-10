//import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebase from 'firebase'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyDHA7VuYc5ZDNDPyEx0TRS6kgDAjClXvoE",
    authDomain: "expense-tracker-6f096.firebaseapp.com",
    projectId: "expense-tracker-6f096",
    storageBucket: "expense-tracker-6f096.appspot.com",
    messagingSenderId: "782264422963",
    appId: "1:782264422963:web:b0ff96b5483c7b9399c946",
    measurementId: "G-ZSDC8XMDF4"
}

firebase.initializeApp(firebaseConfig);
// utils
const db = firebase.firestore()
const auth = firebase.auth()

// export utils/refs
export {
  db,
  auth
}