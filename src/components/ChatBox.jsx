import React, { useEffect, useState, useMemo, useRef } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiSendPlaneFill } from 'react-icons/ri'
import {messageData} from '../data/messageData'
import { formatTimestamp } from '../utils/formatTimeStamp'
import {
  auth, listenForMessages, markMessageAsRead, sendMessage, listenForUserStatus } from '../firebase/firebase'
import logo from '../../public/assets/logo.png'
import { getDayLable, getTimeOnly } from '../utils/dateFormater'
import { formatLastSeen } from "../utils/formatLastSeen";

const ChatBox = ({ selectedUser }) => {
  console.log("ChatBox Render");
  const [messages,setMessages] = useState([]);
  const [messageText , sendMessageText] = useState("");
  // const senderEmail = "john@gmail.com";
  const scrollRef = useRef(null);
  const chatId = auth?.currentUser?.uid < selectedUser?.uid ? `${auth?.currentUser?.uid}-${selectedUser?.uid}` : `${selectedUser?.uid}-${auth?.currentUser?.uid}`;

  const user1 = auth?.currentUser;
  const user2 = selectedUser;
  const senderEmail = auth?.currentUser?.email;
  const [userStatus, setUserStatus] = useState(null);


  useEffect(() => {
    if (!selectedUser) return;

    const unsubscribe = listenForMessages(chatId, setMessages);
    markMessageAsRead(chatId);

    return () => unsubscribe();
  }, [chatId, selectedUser]);


  useEffect(() => {
    if (!selectedUser?.uid) return;

    const unsubscribe = listenForUserStatus(
      selectedUser.uid,
      (status) => {
        setUserStatus(status);
      }
    );

    return unsubscribe;
  }, [selectedUser]);

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

  if (!selectedUser) {
    return (
      <section className="h-screen w-full bg-[#0a0827] flex flex-col justify-center items-center">
        <img src={logo} alt="Logo" width={100} />
        <h1 className="text-3xl text-white font-bold mt-5">Welcome to Chat</h1>
        <p className="text-white/15 text-center mt-2">
          Connect and chat with friends easily, securely, fast and free
        </p>
      </section>
    );
  }


  return ( 
    <>
      <section className="flex flex-col h-screen w-full bg-[#0a0827]">
        <header className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4 bg-[#0f0d2e] border-b border-white/10">

          <div className="relative">
            <img
              src={selectedUser?.image || defaultProfile}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
              alt=""
            />

            {userStatus?.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-[#0f0d2e]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate">
              {selectedUser?.fullName}
            </h3>

            <p className="text-xs">
              {userStatus?.online ? (
                <span className="text-green-400">Online</span>
              ) : (
                <span className="text-white/40">
                    {(formatLastSeen(userStatus?.lastSeen)) === "offline" ? "last seen long time ago" : `last seen ${formatLastSeen(userStatus?.lastSeen)}`}
                </span>
              )}
            </p>
          </div>

        </header>

          <main className="flex flex-col flex-1 overflow-hidden">
          <section className="flex-1 px-3 pt-4 overflow-hidden">            
            <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar pb-5">
                {sortedMessages?.map((msg, index) => {
                  const currentDay = getDayLable(msg.timestamp);
                  const prevDay = index > 0 ? getDayLable(sortedMessages[index - 1].timestamp) : null;

                  const showDateHeader = currentDay !== prevDay;
                  const isSender = msg.sender === senderEmail;
                  
                  return (
                    <div key={msg.id || index} className="mb-2">
                      {/* Date Header */}
                      {showDateHeader && (
                        <div className="flex justify-center my-5">
                          <span className="px-3 py-1 rounded-full bg-white/10 text-white/50 text-xs">
                            {currentDay}
                          </span>
                        </div>
                      )}

                      {/* Message */}
                      <div
                        className={`flex items-start ${isSender ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        {!isSender && (
                          <img
                            src={selectedUser?.image || defaultProfile}
                            className="w-10 h-10 rounded-full object-cover mr-2"
                          />
                        )}

                        <div
                          className={`px-4 py-2 rounded-2xl shadow-sm max-w-[80%] lg:max-w-[60%] break-words ${isSender
                              ? 'bg-violet-500 text-white rounded-br-md'
                              : 'bg-[#1a1740] text-white rounded-bl-md'
                            }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-white/40 text-[10px] text-right mt-1">
                            {getTimeOnly(msg.timestamp)}
                          </p>
                        </div>
                        
                      </div>
                    </div>
                  );
      })}



              </div>
            </section>
            <div className="sticky bottom-0 p-3 bg-[#0f0d2e] border-t border-white/10">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
              <input
                value={messageText}
                onChange={(e) => sendMessageText(e.target.value)}
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-[#1a1740] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50
                " />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="h-12 w-12 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg">
                <RiSendPlaneFill size={25} className="text-white ml-[2px]" />
              </button>
              </form>
            </div>
          </main>
        </section>
    </>
  )
}

export default ChatBox

