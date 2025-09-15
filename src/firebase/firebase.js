import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA76BAT8ksb2fvWHoCisIqIGm9W_enc-7s",
  authDomain: "chat-app-22a97.firebaseapp.com",
  projectId: "chat-app-22a97",
  storageBucket: "chat-app-22a97.firebasestorage.app",
  messagingSenderId: "1092421633157",
  appId: "1:1092421633157:web:bd20813dd40c59620655ec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db} ;
