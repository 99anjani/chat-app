import React, { useState } from 'react'
import defaultProfile from "../../public/assets/default.jpg"
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { addNotification, auth, db, updateUserInChats } from '../firebase/firebase';
import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const ProfileModal = ({user , onClose}) => {

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [image, setImage] = useState(user?.image || defaultProfile);
    const [imageFile, setImageFile] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try{

            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef ,{
                fullName,
                username,
                image
            });
            

            await  updateUserInChats((auth.currentUser.uid),{
                fullName,
                username,
                image,
                email: auth.currentUser.email,
                uid: auth.currentUser.uid
            })

            await addNotification(auth.currentUser.uid, `Your profile has been updated: ${fullName} (@${username})`,"Profile Updated")

            toast.success("Update Sucessfull")

            onClose();



        }catch(error){
            console.error("Error updating profile:", error);
        }
    }


  return (
      <div className='fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]'>
        <div className='relative bg-[#98adf7] w-[40%] rounded-xl shadow-xl'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-300'>
                <h2 className="text-2xl font-semibold text-white ">Update Profile</h2>
                <button className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#080659] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer" onClick={onClose} >
                <FaXmark size={20} />
                </button>
            </div>
            <div className="p-4 md:p-5 mt-0 bg-[#c9def3]">
                <div className="mt-4">
                    <label className="block mb-2">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                    />
                </div>
                <div className="mt-3">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                    />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <img
                        src={image}
                        alt="profile"
                        className="w-[80px] h-[80px] rounded-full object-cover"
                    />
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="flex justify-end gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Save
                    </button>
                </div>

        
            </div>   
        </div>

      </div>
  )
}

export default ProfileModal
