
// import React from 'react'
// import { useNotification } from '../context/NotificationContext'
// import { FaXmark } from 'react-icons/fa6';

// const NotificationDropdown = ({ onClose }) => {
//     const { notifications, markNotificationAsRead } = useNotification();


    
//     return (
//         <div
//             className='backdrop-blur-md fixed inset-0 z-[150] flex justify-center items-center bg-[#00170cb7]'
//             onClick={onClose}
//         >
//             <div
//                 className='relative bg-[#98adf7] w-[60%] rounded-xl shadow-xl'
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className='flex items-center justify-between p-4 border-b border-gray-300'>
//                     <h3 className="text-2xl font-semibold text-white">
//                         Notifications
//                     </h3>

//                     <button
//                         onClick={onClose}
//                         className="text-white hover:bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center"
//                     >
//                         <FaXmark size={18} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-4">
//                     {notifications.length > 0 ? (
//                         <div className='max-h-[400px] overflow-y-auto pr-2'>
//                             {notifications.map((notif) => (
//                                 <div key={notif.id} className="mb-3 p-3 bg-white rounded shadow">
//                                     <p className="text-black font-medium">
//                                         {notif.message}
//                                     </p>
//                                     <span className="text-sm text-gray-500">
//                                         {notif.timestamp?.toDate().toLocaleString()}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-center text-white text-lg opacity-80">
//                             No new notifications
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NotificationDropdown;

import React, { useMemo } from "react";
import { useNotification } from "../context/NotificationContext";
import { FaXmark } from "react-icons/fa6";
import {
    RiNotificationLine,
    RiCheckDoubleLine,
} from "react-icons/ri";

const TYPE_STYLES = {
    login: {
        icon: "🔐",
        bg: "bg-green-500/10",
        text: "text-green-400",
    },
    logout: {
        icon: "👋",
        bg: "bg-gray-400/10",
        text: "text-gray-400",
    },
    message: {
        icon: "💬",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
    },
    default: {
        icon: "🔔",
        bg: "bg-white/5",
        text: "text-slate-400",
    },
};

const NotificationDropdown = ({ onClose }) => {
    const { notifications, markNotificationAsRead } = useNotification();

    const unreadNotifications = useMemo(
        () => notifications.filter((notification) => !notification.read),
        [notifications]
    );

    const handleMarkAllAsRead = () => {
        unreadNotifications.forEach((notification) => {
            markNotificationAsRead(notification.id);
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";

        try {
            return timestamp.toDate().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-modal"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#13113a] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                            Notifications
                        </h3>

                        {notifications.length > 0 && (
                            <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/70">
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <FaXmark size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[500px] overflow-y-auto p-4 app-scrollbar">
                    {notifications.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.map((notification) => {
                                const style =
                                    TYPE_STYLES[notification.type] ||
                                    TYPE_STYLES.default;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`rounded-xl border p-4 transition-all hover:bg-white/[0.05] ${notification.read
                                                ? "border-white/5 bg-white/[0.03]"
                                                : "border-violet-500/20 bg-violet-500/5"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
                                            >
                                                {style.icon}
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    {notification.message}
                                                </p>

                                                <p className="mt-1 text-xs text-white/50">
                                                    {formatDate(notification.timestamp)}
                                                </p>
                                            </div>

                                            {!notification.read && (
                                                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-violet-400" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <RiNotificationLine
                                size={40}
                                className="mb-3 text-white/20"
                            />

                            <p className="text-lg font-medium text-white/70">
                                No notifications
                            </p>

                            <p className="mt-1 text-sm text-white/40">
                                You're all caught up.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
                        <span className="text-sm text-white/50">
                            {unreadNotifications.length} unread
                        </span>

                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={unreadNotifications.length === 0}
                            className="flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:text-white/20"
                        >
                            <RiCheckDoubleLine size={16} />
                            Mark all as read
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;