import React, { useEffect, useState, useMemo } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiSendPlaneFill } from 'react-icons/ri'
import {messageData} from '../data/messageData'
import { formatTimestamp } from '../utils/formatTimeStamp'

const ChatBox = () => {
  const [messages,setMessages] = useState([]);
  const [messageText , sendMessageText] = useState("");
  const senderEmail = "john@gmail.com";

  useEffect(()=>{
    setMessages(messageData);
  },[])

  const sortedMessages = useMemo(()=>{
    return [...messages].sort((a,b) => {
      const aTimeStamp = a.timestamp.seconds + a.timestamp.nanoseconds /1e9 ;
      const bTimeStamp = b.timestamp.seconds + b.timestamp.nanoseconds / 1e9;
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
    setMessages((prevMessages) => [...prevMessages , newMessage])
    sendMessageText("")
  }


  return (
    <section className='flex flex-col items-start justify-start h-screen w-[100%] chat-background-image'>
      <header className='border-b border-gray-500 w-[100%] h-[115px] p-4 bg-white shadow-sm'>
        <main className='flex items-center gap-3'>
          <span>
            <img src={defaultProfile} className='w-11 h-11 rounded-full object-cover' />
          </span>
          <span>
            <h3 className='font-semibold text-[#080659] text-lg'>John Doe</h3>
            <p className='font-light text-[#4c4c53] text-sm'>@john</p>
          </span>
        </main>
      </header>

      <main className='custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between'>
        <section className='px-3 pt-5 b-20 lg:pb-10'>
          <div className='overflow-auto h-[80vh]'>
            {sortedMessages?.map((msg, index) =>(
              <div key={index}>
              {msg?.sender === senderEmail?
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
                      <img src={defaultProfile} className='w-11 h-11 rounded-full object-cover' />
                      <div className='h-auto font-light'>
                        <div className='flex items-center bg-white justify-center p-4 rounded-xl'>
                          <h4>{msg.text}</h4>
                        </div>
                        <p className='text-gray-400 text-xs text-right'>{formatTimestamp(msg?.timestamp)}</p>
                      </div>
                    </span>
                  </div> )
              }


              </div>
            ))}



          </div>
        </section>
        <div className='sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%]'>
          <form onSubmit={handleSendMessage} action="" className='flex items-center h-[45px] w-[100%] bg-white px-3 rounded-lg relative shadow-2xl'>
            <input value={messageText} onChange={(e)=>sendMessageText(e.target.value)} type='text' className='h-full font-light text-[#080659] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-[100%]' placeholder='Write your message...'/>
            <button type='submit' className='flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#C3CFF9] hover:bg-[#4f4dbf]'>
              <RiSendPlaneFill color='#080659'/>
            </button>
          </form>
        </div>
      </main>
    </section>
  )
}

export default ChatBox

