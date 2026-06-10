
import React from 'react'
import { useNotification } from '../context/NotificationContext'
import { FaXmark } from 'react-icons/fa6';

const NotificationDropdown = ({ onClose }) => {
    const { notifications, markNotificationAsRead } = useNotification();


    
    return (
        <div
            className='backdrop-blur-md fixed inset-0 z-[150] flex justify-center items-center bg-[#00170cb7]'
            onClick={onClose}
        >
            <div
                className='relative bg-[#98adf7] w-[60%] rounded-xl shadow-xl'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='flex items-center justify-between p-4 border-b border-gray-300'>
                    <h3 className="text-2xl font-semibold text-white">
                        Notifications
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center"
                    >
                        <FaXmark size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {notifications.length > 0 ? (
                        <div className='max-h-[400px] overflow-y-auto pr-2'>
                            {notifications.map((notif) => (
                                <div key={notif.id} className="mb-3 p-3 bg-white rounded shadow">
                                    <p className="text-black font-medium">
                                        {notif.message}
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        {notif.timestamp?.toDate().toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-white text-lg opacity-80">
                            No new notifications
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
