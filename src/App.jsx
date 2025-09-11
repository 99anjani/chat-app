import React from 'react'
import Login from './components/login'
import Register from './components/Register';
import Navlinks from './components/Navlinks';
import chatBox from './components/ChatBox';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';


const App = () => {
  return (
    <div>
      <div className='flex lg:flex-row flex-col items-start w-[100%]'> 
        <Navlinks/>

        <ChatList/>
        <ChatBox />
      </div>
      <div>
        {/* <Register/> */}
        {/* <Login/> */}
      </div>
      
    </div>
  )
}

export default App
