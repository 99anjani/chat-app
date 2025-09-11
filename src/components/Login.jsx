import React from 'react'
import { TbLogin2 } from "react-icons/tb";

const Login = () => {
  return (
      <section className='flex flex-col justify-center items-center h-[100vh] background-image'>
        <div className='bg-white shadow-6xl p-5 rounded-2xl h-[30rem] w-[25rem] flex flex-col justify-center items-center'>
          <div className='mb-10'>
            <h1 className='text-center font-bold text-[30px]'>Sign In</h1>
            <p className='text-center text-gray-400 text-sm'>Welcome back, login to continue.</p>
          </div>
          <div className='w-full p-2'>
            <input type='email' className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Email'/>
            <input type='password' className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Password' />
          </div>
          <div className='w-full pl-2 pr-2'>
            <button className='bg-[#22054b] text-[#cfc8ff] font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center'>
            Login <TbLogin2 />
            </button>
          </div>
          <div className='mt-5 text-center text-gray-400'>
            <button >
              Don't have account yet? Sign Up
            </button>
          </div>
        </div>
      </section>
    )
}

export default Login
