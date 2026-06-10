import React, { useState, useEffect } from "react";
import defaultProfile from "../../public/assets/default.jpg";
import { doc, updateDoc } from "firebase/firestore";
import {
    addNotification,
    auth,
    db,
    updateUserInChats,
} from "../firebase/firebase";
import { FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";

const ProfileEdit = ({ isOpen, onClose, user, setUserData }) => {
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [image, setImage] = useState(user?.image || defaultProfile);
    const [imageFile, setImageFile] = useState(null);
    const currentUser = auth.currentUser;
    const isOwnProfile = currentUser?.uid === user?.uid;

    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && onClose();

        if (isOpen) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (user && isOpen) {
            setFullName(user.fullName || "");
            setUsername(user.username || "");
            setImage(user.image || defaultProfile);
        }
        console.log("ProfileEdit user:", user);
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        }
        reader.readAsDataURL(file);

        
    };

    const handleSave = async () => {
        try {
            const uid = auth.currentUser.uid;
            const updatedData = {
                fullName,
                username,
                image, 
            }

            await updateDoc(doc(db, "users", uid), updatedData);

            await updateUserInChats(uid, {
                uid,
                email: auth.currentUser.email,
                ...updatedData,
                
            });

            await addNotification(
                uid,
                `Your profile has been updated: ${fullName} (@${username})`,
                "Profile Updated"
            );
            setUserData((prev) => ({
                ...prev,
                ...updatedData,
            }));

            toast.success("Profile Updated successful");
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal Card */}
            <div className="relative w-full max-w-md rounded-2xl bg-[#13113a] border border-white/10 shadow-2xl overflow-hidden">


                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">
                        Update Profile
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition"
                    >
                        <FaXmark size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">

  
                    <div>
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wide">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>


                    <div>
                        <label className="text-xs font-medium text-white/40 uppercase tracking-wide">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>


                    <div className="flex flex-col items-center gap-3 pt-2">
                        <img
                            src={image}
                            alt="profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-sm text-white/60 file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                        />
                    </div>


                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 bg-white/20 hover:bg-white/15 transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-900 transition shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;