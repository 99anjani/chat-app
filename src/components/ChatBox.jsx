import React, { useEffect, useState, useMemo, useRef } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiSendPlaneFill } from 'react-icons/ri'
import {messageData} from '../data/messageData'
import { formatTimestamp } from '../utils/formatTimeStamp'
import { auth, listenForMessages, sendMessage } from '../firebase/firebase'
import logo from '../../public/assets/logo.png'

const ChatBox = ({ selectedUser }) => {
  const [messages,setMessages] = useState([]);
  const [messageText , sendMessageText] = useState("");
  // const senderEmail = "john@gmail.com";
  const scrollRef = useRef(null);
  const chatId = auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid}-${selectedUser?.uid}` : `${selectedUser?.uid}-${auth?.currentUser?.uid}`;

  const user1 = auth?.currentUser;
  const user2 = selectedUser;
  const senderEmail = auth?.currentUser?.email;

  console.log(typeof(chatId));
  console.log(user1);
  console.log(user2);

  useEffect(() => {
    listenForMessages(chatId, setMessages);
  }, [chatId]);



  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
    
  }, [messages])

  const sortedMessages = useMemo(()=>{
    return [...messages].sort((a,b) => {
      const aTimeStamp = a?.timestamp?.seconds + a?.timestamp?.nanoseconds /1e9 ;
      const bTimeStamp = b?.timestamp?.seconds + b?.timestamp?.nanoseconds / 1e9;
      return aTimeStamp - bTimeStamp;
    })
  },[messages])

  const handleSendMessage = (e) => {
    e.preventDefault();
    const newMessage = {
      sender : senderEmail,
      text: messageText,
      timestamp: {
        seconds: Math.floor(Date.now()/1000),
        nanoseconds: 0
      },
    };
    sendMessage(messageText, chatId, user1?.uid, user2?.uid);  
    setMessages((prevMessages) => [...prevMessages , newMessage])
    sendMessageText("")
  }


  return ( 
    <>
    {selectedUser ? (
        <section className='flex flex-col items-start justify-start h-screen w-[100%] chat-background-image'>
          <header className='border-b border-gray-500 w-[100%] h-[115px] p-4 bg-white shadow-sm'>
            <main className='flex items-center gap-3'>
              <span>
                <img src={selectedUser?.image || defaultProfile} className='w-11 h-11 rounded-full object-cover' />
              </span>
              <span>
                <h3 className='font-semibold text-[#080659] text-lg'>{selectedUser?.fullName || "John Doe"}</h3>
                <p className='font-light text-[#4c4c53] text-sm'>@{selectedUser?.username || "john"}</p>
              </span>
            </main>
          </header>

          <main className='custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between'>
            <section className='px-3 pt-5 b-20 lg:pb-10'>
              <div ref={scrollRef} className='overflow-auto h-[80vh]'>
                {sortedMessages?.map((msg, index) => (
                  <div key={index}>
                    {msg?.sender === senderEmail ?
                      (<div className='flex flex-col items-end'>
                        <span className='flex gap-3'>
                          <div className='h-auto font-light me-10'>
                            <div className='flex items-center justify-center bg-white p-4 rounded-xl'>
                              <h3 className='font-medium text-[17px] text-gray-800 w-full break-words'> {msg.text}</h3>
                            </div>
                            <p className='text-gray-400 text-xs text-right'>{formatTimestamp(msg?.timestamp)}</p>
                          </div>
                        </span>
                      </div>)
                      :
                      (<div className='flex flex-col items-start w-full'>
                        <span className='flex gap-3 w-[40%] h-auto ms-10 items-start'>
                          <img src={selectedUser?.image || defaultProfile} className='w-11 h-11 rounded-full object-cover' />
                          <div className='h-auto font-light'>
                            <div className='flex items-center bg-white justify-center p-4 rounded-xl'>
                              <h4>{msg.text}</h4>
                            </div>
                            <p className='text-gray-400 text-xs text-right'>{formatTimestamp(msg?.timestamp)}</p>
                          </div>
                        </span>
                      </div>)
                    }


                  </div>
                ))}



              </div>
            </section>
            <div className='sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%]'>
              <form onSubmit={handleSendMessage} action="" className='flex items-center h-[45px] w-[100%] bg-white px-3 rounded-lg relative shadow-2xl'>
                <input value={messageText} onChange={(e) => sendMessageText(e.target.value)} type='text' className='h-full font-light text-[#080659] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-[100%]' placeholder='Write your message...' />
                <button type='submit' className='flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#C3CFF9] hover:bg-[#4f4dbf]'>
                  <RiSendPlaneFill color='#080659' />
                </button>
              </form>
            </div>
          </main>
        </section>
    ):(
          <section className="h-screen w-[100%] bg-[#d7ddf2]">
            <div className="flex flex-col justify-center items-center h-[100vh]">
              <img src={logo} alt="" width={100} />
              <h1 className="text-[30px] font-bold text-[#080659]  mt-5">Welcome to Chat</h1>
              <p className="text-gray-500">Connect and chat with friends easily, securely, fast and free</p>
            </div>
          </section>
    )}
    </>
  )
}

export default ChatBox

