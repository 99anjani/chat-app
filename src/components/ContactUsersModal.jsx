import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../firebase/firebase';
import defaultProfile from "../../public/assets/default.jpg"
import { FaXmark } from 'react-icons/fa6';
import { RiSearchLine, RiUserLine } from "react-icons/ri";
import { listenForUserStatus } from '../firebase/firebase';

const ContactUsersModal = ({ isOpen, onClose, startChat}) => {
    const[users, setUsers]= useState([]);
    const[isLoading,setIsLoading] = useState(false);
    const[search, setSearch] = useState("");
    const searchRef = useRef(null);
    const [statusMap, setStatusMap] = useState({});

    useEffect(()=> {
        if(isOpen){
            fetchUsers()
            setSearch("");
            setTimeout(() => {
                searchRef.current?.focus();
            },150)
        }
    },[isOpen])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(()=>{
        if(!users.length) return;

        const unsubscribePromises = users.map((user) => {
            return listenForUserStatus(user.uid, (status) => {
                setStatusMap((prev) => ({
                    ...prev,
                    [user.uid]: status
                }));
            });
        });

        return () => {
            unsubscribePromises.forEach((unsubscribe) => unsubscribe());
        };
    }, [users]);


    const fetchUsers = async () => {
        setIsLoading(true);
        try{
            const querySnapshot = await getDocs(collection(db, "users"));
            const allUsers = querySnapshot.docs.map((doc) =>({
                uid: doc.id,
                ...doc.data()
            }));
            setUsers(allUsers);
        }catch(error){
            console.error("Error fetching users: " , error)
        }finally{
            setIsLoading(false);
        }
    }

    const filteredUsers = users
    .filter((user) => 
        user.fullName?.toLowerCase().includes(search.toLowerCase()) || user.username?.toLowerCase().includes(search.toLowerCase())
    ) 
    .sort((user1, user2) => {
        const user1_Online = statusMap[user1.uid]?.online ? 1 : 0;
        const user2_Online = statusMap[user2.uid]?.online ? 1 : 0;
        if(user1_Online !== user2_Online){
            return user2_Online - user1_Online;
        }
        return (user1.fullName || "").localeCompare(user2.fullName || "");
    });
    if (!isOpen) return null;
  return (
      <div className='fixed inset-0 z-[150] flex justify-center items-center bg-black/60 backdrop-blur-md
        p-4 ' onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className=' w-full max-w-md max-h-[90vh] flex flex-col overflow-hiddenrounded-2xl border border-white/10 bg-[#13113a] shadow-2xl animate-in fade-in zoom-in-95 duration-200 app-scrollbar animate-modal'>

              {/* Header */}
              <div className='flex items-center justify-between border-b border-white/10 p-5'>
                <div className='flex items-center gap-3'>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                          <RiUserLine size={18} />
                    </div>

                    <div>
                        <h2 className='text-white font-semibold'>Contacts</h2>
                        <p className='text-white/40 text-sm'>{isLoading ? "Loading..." : `${filteredUsers.length} users`}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/50 bg-white/5 hover:bg-white/20 hover:text-white rounded-lg w-8 h-8 flex items-center justify-center">
                    <FaXmark/>
                </button>
              </div>

              {/* Search */}
              <div className='flex items-center gap-2 border-b border-white/10 p-4'>
                <RiSearchLine size={18} className='text-white/40' />
                <input
                  type="text"
                  placeholder="Search by username or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  ref={searchRef}
                  className="placeholder:text-white/30 bg-transparent flex-1 outline-none text-white"
                  />
                  {search && (
                      <button onClick={() => setSearch("")} className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10  text-white/60 hover:bg-white/20">
                          <FaXmark size={10} />
                      </button>
                  )}
              </div> 
            
            {/* User List */}
            <div className='flex-1 overflow-y-auto p-3'>
             {isLoading ? (
             <div className="flex flex-col items-center justify-center py-12">
                <div className='h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-violet-400'/>
                <p className="mt-3 text-sm text-white/50">
                    Loading contacts...
                </p>
             </div>
             ): filteredUsers.length > 0 ? (
                <ul className='space-y-1'>
                {filteredUsers.map((user)=>{
                    const status = statusMap[user.uid];
                    const isOnline = status?.online;
                    return(
                        <li key={user.uid}>
                            <button onClick={() => startChat(user)} className="group flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 border border-transparent text-left transition-all hover:border-white/10">
                                <div className="relative shrink-0">
                                    <img src={user.image || defaultProfile} alt={user.fullName} className='h-12 w-12 rounded-full border-2 border-white/10 object-cover' onError={(e) => { e.target.src = defaultProfile }} />
                                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#13113a] ${isOnline ? "bg-green-500" : "bg-gray-400"}`}>
                                        
                                    </span>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='truncate text-white text-sm font-semibold'>{user.fullName}</p>
                                    <p className='text-white/40 text-xs'>@{user.username}</p>
                                </div>
                                <span className="text-xs text-violet-400 transition group-hover:opacity-100">
                                    Chat →
                                </span>
                            </button>
                        </li>
                    )
                    
                })}
                </ul>
             ):(
                <div className="flex flex-col items-center justify-center py-12 text-center ">
                    <RiUserLine size={40} className="text-white/20" />
                        <p className="mt-3 text-sm text-white/50">
                            {search ? "No results found" : "No users yet"}
                        </p>
                        {search && (
                            <p className="text-xs text-white/30">
                               Try a different name or username
                            </p>
                        )}
                </div>
             )
            }
            </div>

        </div>
     </div>
  )
}

export default ContactUsersModal
