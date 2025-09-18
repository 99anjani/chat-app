import React, { useEffect, useState } from 'react'
import Login from './components/login'
import Register from './components/Register';
import Navlinks from './components/Navlinks';
import chatBox from './components/ChatBox';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
import {auth} from "./firebase/firebase"

const App = () => {

  const [isLogin , setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedUser , setSelectedUser] = useState(null);

  useEffect (() => {
    const currentUser = auth.currentUser;
    if(currentUser){
      setUser(currentUser)
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    });

    return ()=> unsubscribe(); //cleanup
  },[])

  return (
    
    <div>
      {user? (
        <div className='flex lg:flex-row flex-col items-start w-[100%]' >
          <Navlinks />
          <ChatList setSelectedUser={setSelectedUser}/>
          <ChatBox selectedUser={selectedUser} />
        </div >
      ):(
          <div>
            {isLogin ? <Login isLogin={isLogin} setIsLogin={setIsLogin}/> : <Register isLogin={isLogin} setIsLogin={setIsLogin} />}
          </div> 
      )}
    </div>
  )
}

export default App
