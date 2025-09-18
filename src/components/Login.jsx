import React, {useState} from 'react'
import { TbLogin2 } from "react-icons/tb";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { toast } from "react-toastify";

const Login = ({ isLogin, setIsLogin }) => {

    const [userData, setUserData] = useState({email: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleChangeUserData = (e) =>{
      const {name, value} = e.target;
  
      setUserData((prevState) => ( 
        {
          ...prevState,
          [name] : value,
        }
      ) ) 
    }
    const handleAuth = async() =>{
      setIsLoading(true);
      try{
        await signInWithEmailAndPassword(auth,  userData?.email, userData.password)
        toast.success("Login successful!");
      }
      catch(error){
        if (error.code === "auth/user-not-found") toast.error("User not found.");
        else if (error.code === "auth/wrong-password") toast.error("Incorrect password.");
        else if (error.code === "auth/invalid-email") toast.error("Invalid email address.");
        else toast.error(error.message);
        // console.log(error)
        // alert(error.message)
      } finally{
        setIsLoading(false)
      }
    }

  return (
      <section className='flex flex-col justify-center items-center h-[100vh] background-image'>
        <div className='bg-white shadow-6xl p-5 rounded-2xl h-[30rem] w-[25rem] flex flex-col justify-center items-center'>
          <div className='mb-10'>
            <h1 className='text-center font-bold text-[30px]'>Sign In</h1>
            <p className='text-center text-gray-400 text-sm'>Welcome back, login to continue.</p>
          </div>
          <div className='w-full p-2'>
            <input  name="email" onChange={handleChangeUserData} type='email' className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Email'/>
            <input type='password' name='password' onChange={handleChangeUserData} className='border border-blue-600 w-full p-2 rounded-md bg-[#caf1f8] text-[#0a0246] mb-3 font-medium outline-none placeholder:text-[#4d4566]' placeholder='Password' />
          {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
          </div>
          <div className='w-full pl-2 pr-2'>
            <button disabled={isLoading} onClick={handleAuth} className='bg-[#22054b] text-[#cfc8ff] font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center'>
            {
              isLoading ? 
              <>
                  Processing...
              </> :
              <>
                  Login <TbLogin2 />
              </>
            }
            </button>
          </div>
          <div className='mt-5 text-center text-gray-400'>
          <button onClick={() => setIsLogin(!isLogin)}>
              Don't have account yet? Sign Up
            </button>
          </div>
        </div>
      </section>
    )
}

export default Login
