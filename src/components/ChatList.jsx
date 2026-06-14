
import React, { useEffect, useMemo, useRef, useState } from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { RiMore2Fill, RiSearchLine } from 'react-icons/ri'
import { FaXmark } from 'react-icons/fa6'
import { formatTimestamp } from '../utils/formatTimeStamp'
import { auth, db, listenForChats, listenForUnreadCount } from '../firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import ProfileModal from './ProfileModal'
import { FaUser } from "react-icons/fa";


const ChatList = ({ setSelectedUser, selectedUser }) => {
  console.log("ChatList Render");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [search, setSearch] = useState("");
  const unreadUnsubscribesRef = useRef({});

  useEffect(() => {
    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      setUser(doc.data());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenForChats(setChats);
    return () => unsubscribe();
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

  const startChat = (user) => setSelectedUser(user);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTs = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
      const bTs = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;
      return bTs - aTs;
    });
  }, [chats]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return sortedChats;
    const q = search.toLowerCase();
    return sortedChats.filter((chat) =>
      chat?.users?.some(
        (u) =>
          u.email !== auth?.currentUser?.email &&
          (u.fullName?.toLowerCase().startsWith(q) || u.username?.toLowerCase().startsWith(q))
      )
    );
  }, [sortedChats, search]);

  return (
    <section className="relative hidden lg:flex flex-col h-screen w-[320px] shrink-0 bg-[#0f0d2e] border-r border-white/10">

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 z-10 bg-[#0f0d2e]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.image || defaultProfile}
              className="w-11 h-11 object-cover rounded-full ring-2 ring-violet-500/40"
              alt=""
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-[#0f0d2e]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">
              {user?.fullName || 'John Doe'}
            </h3>
            <p className="text-white/40 text-xs">@{user?.username || 'john'}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <RiMore2Fill size={18} />
          </button>
          {showMenu && (
            // <div className="absolute right-0 mt-2 w-40 bg-[#1a1740] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            //   <button
            //     onClick={() => { setShowProfileModal(true); setShowMenu(false); }}
            //     className="block w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            //   >
            //     View Profile
            //   </button>
            // </div>
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-[140px] bg-[#13114a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => { setShowProfileModal(true); setShowMenu(false) }}
                  className="block w-full text-left px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white text-[13px] transition-colors touch-manipulation"
                >
                  View Profile
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 bg-[#1a1740] border border-white/10 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-colors">
          <RiSearchLine size={15} className="text-white/30 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/50 shrink-0"
            >
              <FaXmark size={9} />
            </button>
          )}
        </div>
        
      </div>

      {/* List */}
      <main className="flex-1 overflow-y-auto p-2 space-y-0.5 hide-scrollbar">
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <RiSearchLine size={20} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">
              {search ? 'No conversations found' : 'No conversations yet'}
            </p>
            {search && <p className="text-white/20 text-xs mt-1">Try a different name</p>}
          </div>
        )}

        {filteredChats.map((chat) => (
          <div key={chat?.id}>
            {chat?.users
              ?.filter((u) => u.email !== auth?.currentUser?.email)
              .map((otherUser) => {
                const hasUnread = unreadCounts[chat.id] > 0;
                const isActive = selectedUser?.uid === otherUser?.uid;

                return (
                  <button
                    key={otherUser.uid || otherUser.email}
                    onClick={() => startChat(otherUser)}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-all duration-150
                      ${hasUnread
                        ? 'bg-violet-500/20 hover:bg-violet-500/25 border border-transparent'
                        : isActive
                        ? 'bg-violet-500/10 border border-violet-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={otherUser?.image || defaultProfile}
                        className={`h-11 w-11 rounded-full object-cover ring-2 transition-all
                          ${isActive ? 'ring-violet-500/60' : 'ring-white/10'}`}
                        alt=""
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isActive || hasUnread ? 'text-white font-semibold' : 'text-white/75 font-medium'}`}>
                        {otherUser?.fullName || 'User'}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-violet-300/70' : hasUnread ? 'text-violet-300 font-medium' : 'text-white/30'}`}>
                        {chat?.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[11px] tabular-nums ${isActive ? 'text-violet-300/80' : hasUnread ? 'text-violet-300' : 'text-white/25'}`}>
                        {formatTimestamp(chat?.lastMessageTimestamp)}
                      </span>
                      {hasUnread && !isActive && (
                        <span className="bg-violet-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center px-1.5 rounded-full font-semibold">
                          {unreadCounts[chat.id]}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </main>

      {showProfileModal && (
        <ProfileModal isOpen={showProfileModal} user={user} onClose={() => setShowProfileModal(false)} />
      )}
    </section>
  );
};

export default ChatList;