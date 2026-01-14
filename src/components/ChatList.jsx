import React, { useEffect, useMemo, useRef, useState } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiMore2Fill } from 'react-icons/ri'
import SearchModel from './SearchModel'
import chatData from '../data/chats'
import { formatTimestamp } from '../utils/formatTimeStamp'
import { auth, db, listenForChats, listenForUnreadCount} from '../firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import ProfileModal from './ProfileModal'

const ChatList = ({ setSelectedUser }) => {

  const [chats,setChats]=useState([]);
  const [user,setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const unreadUnsubscribesRef = useRef({});

  useEffect(() => {
    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      setUser(doc.data());
    });
    return unsubscribe;
  }, []);

  console.log(user?.fullName);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    Object.values(unreadUnsubscribesRef.current).forEach((unsub) => unsub());
    unreadUnsubscribesRef.current = {};

    if (chats.length === 0) return;

    chats.forEach((chat) => {
      const unsub = listenForUnreadCount(chat.id, (count) => {
        setUnreadCounts((prev) => ({ ...prev, [chat.id]: count }));
      });
      unreadUnsubscribesRef.current[chat.id] = unsub;
    });

    return () => {
      Object.values(unreadUnsubscribesRef.current).forEach((unsub) => unsub());
    };
  }, [chats]);


  const startChat = (user) => {
    setSelectedUser(user);
  };

  
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTimestamp = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
      const bTimestamp = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;
      return bTimestamp - aTimestamp;
    });
  }, [chats]);



  return (
    <section className='relative hidden lg:flex flex-col items-start justify-start bg-white h-[100vh] md:w-[450px]'>
      <header className='flex items-center justify-between w-[100%] lg:border-b border-gray-500 border-b-2 p-6 sticky md:static top-0 z-[100]'>
        <main className='flex items-center gap-3'>
          <img src={user?.image || defaultProfile} className='w-[54px] h-[54px] object-cover rounded-full' alt='' />
          <span>
            <h3 className='p-0 font-semibold text-[#080659] md:text-[17px]'>{user?.fullName || 'John Doe'}</h3>
            <p className='p-0 font-light text-[#080659] md:text-[15px]'>@{ user?.username || "john"}</p>
          </span>
        </main>
        <div className="relative " onBlur={() => setShowMenu(false)}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className='bg-[#C3CFF9] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg'
          >
            <RiMore2Fill color='#080659' className='h-[28px] w-[28px] cursor-pointer' />
          </button>


          {showMenu && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-50">
              <button
                onClick={() => { setShowProfileModal(true); setShowMenu(false); }}
                className="block w-full text-left px-4 py-2 hover:bg-[#e2e6f6]  rounded-lg shadow-md"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>
      </header>

      <div className='w-[100%] mt-[10px] px-5'>
        <header className='flex items-center justify-between'>
          <h3 className='text-[16px]'>Message ({chats?.length || 0})</h3>
          <SearchModel startChat={startChat} />
        </header>
      </div>

      <main className="flex flex-col items-start mt-[1.5rem] pb-3 custom-scrollbar w-[100%] h-[100%]">
        {sortedChats?.map((chat) => (
          <button key={chat?.id} className={`flex items-start justify-between w-[100%] border-b border-[#9090902c] px-5 pb-3 pt-3 ${unreadCounts[chat.id] > 0 ? 'bg-[#e0e1e3]' : 'bg-white'}`}>
              {
              chat?.users?.filter((user) => user.email !== auth?.currentUser.email)
                  ?.map((user) =>(
                    <>
                      <div onClick={() => startChat(user)} className='flex items-start gap-3 cursor-pointer'>
                        <img src={user?.image || defaultProfile} className='h-[50px] w-[50px] rounded-full object-cover' alt='' />
                        <span>
                          <h2 className='p-0 font-semibold text-[#080659] text-[15px] text-left'>{user?.fullName || "John Doe"}</h2>
                          <p className={`p-0 text-[#080659] text-[13px] text-left ${unreadCounts[chat.id] > 0 ? 'font-bold italic' : 'font-light'}`}>{chat?.lastMessage}</p>
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-between text-right">
                        <p className={`text-[10px] font-light ${unreadCounts[chat.id] > 0 ? 'text-[#080659] font-bold' : 'text-gray-400'}`}>
                          {formatTimestamp(chat?.lastMessageTimestamp)}
                        </p>
                        {unreadCounts[chat.id] > 0 && (
                          <span className="bg-blue-800 text-white text-[10px] px-2 py-1 rounded-full">
                            {unreadCounts[chat.id]}
                          </span>
                        )}
                      </div>
                    </>
                  )
                  )
              }
            </button>
        ))}
      </main>

      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
      
    </section>
  )
}

export default ChatList
