import React, { useEffect, useState } from 'react'
import Login from './components/Login';
import Register from './components/Register';
import Navlinks from './components/Navlinks';
import chatBox from './components/ChatBox';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
import {auth} from "./firebase/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider, useNotification } from './context/NotificationContext';

const AppContent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { addNotification } = useNotification(); 

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser)
      addNotification(`${currentUser.email} logged in`, "success");
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div className='flex lg:flex-row flex-col items-start w-[100%]'>
          <Navlinks setSelectedUser={setSelectedUser} />
          <ChatList setSelectedUser={setSelectedUser} />
          <ChatBox selectedUser={selectedUser} />
        </div>
      ) : (
        <div>
          {isLogin ? <Login isLogin={isLogin} setIsLogin={setIsLogin} /> : <Register isLogin={isLogin} setIsLogin={setIsLogin} />}
        </div>
      )}
    </div>
  )
}

const App = () => (
  <NotificationProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
    <AppContent />
  </NotificationProvider>
);

export default App;
