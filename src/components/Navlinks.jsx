import React, { useState, useEffect } from 'react'
import logo from '../../public/assets/logo.png'
import { signOut } from 'firebase/auth';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { addNotification, auth,db } from '../firebase/firebase';
import { RiArrowDownSFill, RiBardLine, RiChatAiFill, RiChatAiLine, RiFile4Line, RiFolderUserLine, RiNotificationLine, RiShutDownLine, RiMenuLine, RiCloseLine, RiNotification2Line, RiUserSettingsLine } from "react-icons/ri";
import NotificationDropdown from './NotificationDropdown';
import ContactUsersModal from './ContactUsersModal';
import toast from "react-hot-toast";
import LogoutConfirmModal from './LogoutConfirmModal';
import {useNotification} from '../context/NotificationContext';
import { setUserOffline } from '../firebase/firebase';
import ProfileEdit from './ProfileEdit';
const NavItem = ({ icon, label, onClick, active, danger }) => (
  <li className="group relative flex justify-center">
    <button
      onClick={onClick}
      className={`
        w-[46px] h-[46px]
        rounded-xl
        flex items-center justify-center
        transition-all duration-200
        hover:scale-105

        ${danger
          ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
          : active
            ? "bg-indigo-500/20 text-violet-300"
            : "text-white/50 hover:bg-white/10 hover:text-white"
        }
      `}
      title={label}
    >
      {icon}
    </button>

    <span
      className="
        hidden lg:block
        absolute left-full ml-3 top-1/2 -translate-y-1/2
        bg-indigo-950 text-white/90 text-xs
        px-2 py-1 rounded-md
        border border-white/10
        opacity-0 group-hover:opacity-100
        pointer-events-none
        whitespace-nowrap
      "
    >
      {label}
    </span>
  </li>
);

const Navlinks = ({ setSelectedUser }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const [mobileOpen, setMobileOpen] = useState(false);
  const[isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { notifications, pushNotification, markNotificationAsRead } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await signOut(auth);
      await setUserOffline(userId);
      await addNotification(userId, "You have successfully logged out", "logout");

      toast.success("Logged out successfully!");
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Try again.");
    }
  };

  const startChat = (user) => {
    setIsContactOpen(false);
    setSelectedUser(user);
  };

  const navItems = [
    {
      id: "chat",
      icon: <RiChatAiLine size={22} />,
      label: "Messages",
      onClick: () => setActiveNav("chat"),
    },
    {
      id: "contacts",
      icon: <RiFolderUserLine size={22} />,
      label: "Contacts",
      onClick: () => {
        setActiveNav("contacts");
        setIsContactOpen(true);
      },
    },
    {
      id: "files",
      icon: <RiFile4Line size={22} />,
      label: "Files",
      onClick: () => setActiveNav("files"),
    },
    {
      id:"profile",
      icon: <RiUserSettingsLine size={22} />,
      label: "Profile",
      onClick: () => {
        setActiveNav("profile");
        setIsProfileEditOpen(true);
      },
    }
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!auth.currentUser) return;

        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData({
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            ...userSnap.data(),
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUserData();
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0d0b2b] border-b border-white/10 sticky top-0 z-[110] w-full">
        <img src={logo} className="w-9 h-9 object-contain" alt="Logo" />
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white"
        >
          {mobileOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>

        
      </header>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[105]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0
          h-screen w-[76px]
          bg-[#0d0b2b]
          border-r border-white/10
          flex flex-col items-center
          pb-5
          z-[120]
          transition-transform duration-300

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="hidden lg:flex w-full justify-center border-b border-white/10 py-5 mb-2">
          <img src={logo} className="w-11 h-11 object-contain" alt="Logo" />
        </div>

        {/* Nav */}
        <nav className="flex-1 w-full">
          <ul className="flex flex-col items-center gap-2 pt-3">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
                active={activeNav === item.id}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="w-full">
          <ul className="flex flex-col items-center gap-2">
            
            
            <NavItem
              icon={
                <div className="relative">
                  <RiNotification2Line size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] px-1.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              }
              label="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  notifications.forEach((notif) => {
                    if (!notif.read) markNotificationAsRead(notif.id);
                  });
                }
              }} />
            

            <NavItem
              icon={<RiShutDownLine size={22} />}
              label="Sign out"
              onClick={() => setShowLogoutConfirm(true)}
              danger
            />
          </ul>
        </div>
      </aside>
      {showNotifications && (
        <NotificationDropdown
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Modals */}
      <ContactUsersModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        startChat={startChat}
      />
      <ProfileEdit
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        user={userData}
        setUserData={setUserData}
      />

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Navlinks;