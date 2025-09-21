import React, { useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import { RiNotificationLine } from 'react-icons/ri';
import { FaXmark } from 'react-icons/fa6';

const NotificationDropdown = () => {
    const { notifications, pushNotification, markNotificationAsRead } = useNotification();
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);


    return (
        <div className='relative'>
            <button
                onClick={() => setOpen(!open)}
                className="lg:text-[28px] text-[22px] cursor-pointer relative"
            >
                <RiNotificationLine color="#fff" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] px-1 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <div className='fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]'>
                    <div className='relative bg-[#98adf7] w-[40%] rounded-xl shadow-xl'>
                        <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-300'>
                            <h3 className="text-2xl font-semibold text-white ">Notifications</h3>
                            <button className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#080659] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer">
                            <FaXmark size={20} onClick={closeModal} />
                            </button>
                        </div>
                        <div className="p-4 md:p-5 mt-0">
                            {notifications.length > 0 ? (
                                <div>
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="mb-3 p-2 bg-white rounded shadow">
                                            <p className="text-black font-medium">{notif.message}</p>
                                            <span className="text-sm text-gray-500">{notif.timestamp?.toDate().toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) :(
                                <div>
                                        <p className="text-center text-white text-lg opacity-80">
                                            No new notifications
                                        </p>
                                </div>
                            )}
                        </div>   
                    </div>
               </div>
            )}
        </div>
    )
}

export default NotificationDropdown
