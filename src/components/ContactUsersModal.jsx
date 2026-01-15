import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase/firebase';
import defaultProfile from "../../public/assets/default.jpg"
import { FaXmark } from 'react-icons/fa6';

const ContactUsersModal = ({ isOpen, onClose, startChat}) => {
    const[users, setUsers]= useState([]);

    useEffect(()=> {
        if(isOpen){
            fetchUsers()
        }
    },[isOpen])

    const fetchUsers = async () => {
        try{
            const querySnapshot = await getDocs(collection(db, "users"));
            const allUsers = querySnapshot.docs.map((doc) => doc.data());
            setUsers(allUsers);
        }catch(error){
            console.error("Error fetching users: " , error)
        }
    }
    if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-[150] flex justify-center items-center bg-[#00170cb7]'>
            <div className='relative bg-[#98adf7] w-[40%] rounded-xl shadow-xl'>
                <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-300'>
                    <h2 className="text-2xl font-semibold text-white ">Contact users</h2>
                    <button className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#080659] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer" onClick={onClose} >
                    <FaXmark size={20} />
                    </button>
                </div>
              <div className="max-h-[450px] overflow-y-auto pr-2 rounded p-4 md:p-5 mt-0 bg-[#c9def3]">
                {users.length > 0 ? (
                    users.map((user, index)=>(
                            <div key={index} className='flex items-start gap-3 bg-[#aebef6] p-2 mb-3 rounded-lg cursor-pointer border border-[#ffffff20] shadow-lg' onClick={()=>startChat(user)}>
                                <img src={user?.image || defaultProfile} className="h-[60px] w-[60px] rounded-full" alt='' />
                                <span>
                                <h2 className="p-0 font-semibold text-white text-[18px]">{user?.fullName}</h2>
                                <p className="text-[13px] text-white">@{user?.username}</p>
                                </span>
                            </div>
                        ))
                ) : (
                    <div>
                        <p className="text-center text-white text-lg opacity-80">
                            No Users
                        </p>
                    </div>
                )}
                </div>   
            </div>
        
          </div>
  )
}

export default ContactUsersModal
