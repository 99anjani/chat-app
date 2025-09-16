import React, { useEffect, useMemo, useState } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiMore2Fill } from 'react-icons/ri'
import SearchModel from './SearchModel'
import chatData from '../data/chats'
import { formatTimestamp } from '../utils/formatTimeStamp'
import { listenForChats} from '../firebase/firebase'
const ChatList = () => {

  const [chats,setChats]=useState([]);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);

    return () =>{
      unsubscribe();
    }
  }, []);
  
  const sortedChats = useMemo(()=>{
    return [...chats].sort((a,b) => {
      const aTimeStamp = a.lastMessageTimestamp.seconds + a.lastMessageTimestamp.nanoseconds /1e9 ;
      const bTimeStamp = b.lastMessageTimestamp.seconds + b.lastMessageTimestamp.nanoseconds / 1e9;

      return bTimeStamp - aTimeStamp;
    })
  },[chats])

  return (
    <section className='relative hidden lg:flex flex-col items-start justify-start bg-white h-[100vh] md:w-[450px]'>
      <header className='flex items-center justify-between w-[100%] lg:border-b border-gray-500 border-b-2 p-6 sticky md:static top-0 z-[100]'>
        <main className='flex items-center gap-3'>
          <img src={defaultProfile} className='w-[54px] h-[54px] object-cover rounded-full' alt='' />
          <span>
            <h3 className='p-0 font-semibold text-[#080659] md:text-[17px]'>{'John Doe'}</h3>
            <p className='p-0 font-light text-[#080659] md:text-[15px]'>@john</p>
          </span>
        </main>
        <button className='bg-[#C3CFF9] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg'>
          <RiMore2Fill color='#080659' className='h-[28px] w-[28px]' />
        </button>
      </header>

      <div className='w-[100%] mt-[10px] px-5'>
        <header className='flex items-center justify-between'>
          <h3 className='text-[16px]'>Message ({chats?.length || 0})</h3>
          <SearchModel/>
        </header>
      </div>

      <main className="flex flex-col items-start mt-[1.5rem] pb-3 custom-scrollbar w-[100%] h-[100%]">
        {sortedChats?.map((chat) => (
            <button key={chat?.uid} className="flex items-start justify-between w-[100%] border-b border-[#9090902c] px-5 pb-3 pt-3">
              {
              chat?.users?.filter((user) => user.email !== "john@gmail.com")
                  ?.map((user) =>(
                    <>
                      <div className='flex items-start gap-3'>
                        <img src={user?.image || defaultProfile} className='h-[50px] w-[50px] rounded-full object-cover' alt='' />
                        <span>
                          <h2 className='p-0 font-semibold text-[#080659] text-[15px] text-left'>{user?.fullName || "John Doe"}</h2>
                          <p className='p-0 font-light text-[#080659] text-[13px] text-left'>{chat?.lastMessage}</p>
                        </span>
                      </div>
                      <p className='text-[10px] font-light text-gray-400'>{formatTimestamp(chat?.lastMessageTimestamp)}</p>
                    </>
                  )
                  )
              }
            </button>
        ))}
      </main>
      
    </section>
  )
}

export default ChatList
