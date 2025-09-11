import React ,{useState}from 'react'
import { FaUserPlus } from "react-icons/fa";

const Register = () => {

  const [userData, setUserData]=useState({fullName: "", email: "", password: ""})

  const handleChangeUserData = (e) =>{
    const {name, value} = e.target;

    setUserData((prevState) => (
      {
        ...prevState,
        [name] : value,
      }
    ) ) 
  }
  const handleAuth = () =>{
    try{
      alert("Registration Sucessful")
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <section className='flex flex-col justify-center items-center h-[100vh] background-image'>
      <div className='bg-white shadow-6xl p-5 rounded-2xl h-[30rem] w-[25rem] flex flex-col justify-center items-center'>
        <div className='mb-10'>
          <h1 className='text-center font-bold text-[30px]'>Sign Up</h1>
          <p className='text-center text-gray-400 text-sm'>Join now and start chatting instantly.</p>
        </div>
        <div className='w-full p-2'>
          <input type='text' name='fullName' onChange={handleChangeUserData} className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Full Name'/>
          <input type='email' name='email' onChange={handleChangeUserData}  className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Email'/>
          <input type='password' name='password' onChange={handleChangeUserData} className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Password' />
        </div>
        <div className='w-full pl-2 pr-2'>
          <button onClick={handleAuth} className='bg-[#22054b] text-[#cfc8ff] font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center'>
            Register <FaUserPlus/>
          </button>
        </div>
        <div className='mt-5 text-center text-gray-400'>
          <button >
            Already have an Account? Sign In
          </button>
        </div>
      </div>
    </section>
  )
}

export default Register
