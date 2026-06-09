import React, { useState } from 'react'
import { FaUserPlus } from "react-icons/fa";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addNotification, auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from "react-hot-toast";


const Register = ({ isLogin, setIsLogin }) => {

  const [userData, setUserData] = useState({ fullName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleChangeUserData = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => (
      {
        ...prevState,
        [name]: value,
      }
    ))
  }
  const handleAuth = async () => {

    const { fullName, email, password } = userData;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required!");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {

      const userCredentials = await createUserWithEmailAndPassword(auth, userData?.email, userData?.password);
      const user = userCredentials.user;

      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split("@")[0],
        fullName: userData.fullName,
        image: "",

      })

      await addNotification(
        user.uid,
        "Welcome to our chat app! Your account has been created successfully.",
        "registration"
      );

      toast.success("Registration successful!");
    }
    catch (error) {
      if (error.code === "auth/email-already-in-use") toast.error("Email already registered.");
      else if (error.code === "auth/weak-password") toast.error("Password should be at least 6 characters.");
      else toast.error(error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 via-sky-950 to-slate-900 p-6">

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

        <div className='text-center mb-4'>
          <h1 className='text-2xl font-bold text-white'>Sign Up</h1>
          <p className='text-center text-gray-400 text-sm'>Join now and start chatting instantly.</p>
        </div>

        <div className='w-full p-2'>
          <input type='text' name='fullName' onChange={handleChangeUserData} className='w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-500 mb-1' placeholder='Full Name' />
          <input type='email' name='email' onChange={handleChangeUserData} className='w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-500 mb-1' placeholder='Email' />
          <input type='password' name='password' onChange={handleChangeUserData} className='w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-500 mb-1' placeholder='Password' />
        </div>
        <div className='w-full pl-2 pr-2'>
          <button disabled={isLoading} onClick={handleAuth} className='bg-[#22054b] text-[#cfc8ff] font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center'>

            {
              isLoading ?
                <>
                  Processing...
                </> :
                <>
                  Register <FaUserPlus />
                </>
            }
          </button>
        </div>
        <div className='mt-5 text-center text-gray-400'>
          <button onClick={() => setIsLogin(!isLogin)}>
            Already have an Account? Sign In
          </button>
        </div>

      </div>
    </div>
  )
}

export default Register
