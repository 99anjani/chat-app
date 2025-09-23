import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import {RiSearchLine } from 'react-icons/ri'
import defaultProfile from '../../public/assets/user_1.png'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const SearchModel = ({ startChat }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const openModal = () => setIsModalOpen (true);
  const closeModal = () =>  setIsModalOpen (false);

  const handleSearch = async () => {
    if(!searchTerm.trim()){
      alert("Please enter a search term")
      return;
    }
    try{
      const lowSearchTerm = searchTerm.toLowerCase();
      const q = query(collection(db, "users"), where("username", ">=", lowSearchTerm), where("username", "<=", lowSearchTerm + "\uf8ff"));
      const querySnapshot = await getDocs(q);

      const foundUsers = [];

      querySnapshot.forEach((doc) => {
        foundUsers.push(doc.data());
      });

      setUsers(foundUsers);

      if(foundUsers.length === 0){
        alert("No Users Found")
      }
    }catch(error){
      console.error(error);
    }

  }

  return (
    <div>
      <button onClick={openModal} className='bg-[#C3CFF9] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg cursor-pointer'>
        <RiSearchLine color="#080659" className='w-[18px] h-[18px]' />
      </button>

      {isModalOpen && (
        <div className='fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]' >
          <div className='relative p-4 w-full max-w-lg max-h-full'>
            <div className='relative bg-[#98adf7] w-[100%] rounded-xl shadow-xl'>
              <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-300'>
                <h3 className="text-xl font-semibold text-white">Search Chat</h3>
                <button className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#080659] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer" onClick={closeModal}>
                  <FaXmark size={20}  />
                </button>
              </div>
              <div className="p-4 md:p-5">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input onChange={(e)=> setSearchTerm(e.target.value)} type="text" className="bg-white border border-gray-300 text-[#080659] text-sm rounded-lg outline-none w-full p-2.5" placeholder="Search users" />
                    <button onClick={handleSearch} className="bg-[#080659] text-white px-3 py-2 rounded-lg cursor-pointer">
                      <FaSearch />
                    </button>
                  </div>
                </div>

                <div className='mt-6'>
                  {users?.map((user) => (
                    <div onClick={()=>{
                      console.log(user);
                      startChat(user);
                    }}
                    className='flex items-start gap-3 bg-[#aebef6] p-2 mb-3 rounded-lg cursor-pointer border border-[#ffffff20] shadow-lg '>
                      <img src={user?.image || defaultProfile} className="h-[50px] w-[60px] rounded-full" alt='' />
                      <span>
                        <h2 className="p-0 font-semibold text-white text-[18px]">{user?.fullName}</h2>
                        <p className="text-[13px] text-white">@{user?.username}</p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default SearchModel;
