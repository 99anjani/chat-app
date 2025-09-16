import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {collection, doc, getFirestore, onSnapshot} from "firebase/firestore";

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

export const listenForChats = (setChats) => {
  const chatRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatRef, (snapshot) => {
    const chatList = snapshot.docs.map((doc) =>({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredChats = chatList.filter((chats) =>  chat?.users?.some((user)=> user.email === auth.currentUser.email));
    setChats(filteredChats);
  });
  return unsubscribe;
}

export {auth, db} ;
