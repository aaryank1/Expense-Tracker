import React, {useState, useRef, useContext} from 'react'
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

const Login = () => {
  const {setUserName, setRegUserId} = useContext(UserContext)
  const [email, setEmail] = useState("");
  const [pwd, setpwd] = useState("");
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState(false);

  const pwdRef = useRef();
  const visibilityRef = useRef();

  const handleVisibility = () => {
    if(visibility){
      pwdRef.current.type = "text"
      visibilityRef.current.src = `${assets.openeye}`;
      setVisibility(!visibility);
    }
    else{
      pwdRef.current.type = "password"
      visibilityRef.current.src = `${assets.closedeye}`;
      setVisibility(!visibility);
    }
  }

  const handleLogin = async (e) =>{
    e.preventDefault();

    const userInput = {
      email: email,
      password: pwd
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, userInput);
      if(response.data.success){
        setRegUserId(response.data.userId);
        setUserName(response.data.username);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center text-xl'>
      <div className='p-4 rounded-lg flex flex-col gap-8 justify-center items-center text-center w-full h-full md:w-1/3 md:h-1/2 md:border md:border-black'>
        
          <div className='font-bold text-3xl'>
            <h1>Login</h1>
          </div>

        <form onSubmit={handleLogin} method="post">
          <div className='flex flex-col justify-center gap-1 text-start'>
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>{setEmail(e.target.value)}} className='border border-black p-2 h-8' type="email" name="email" id="email" value={email} />
            <label htmlFor="pwd">Password</label>
            <div className='flex gap-1 border border-black p-1'>
              <input ref={pwdRef} onChange={(e) => {setpwd(e.target.value)}} className=' outline-none p-2 h-8' type="password" name="pwd" id="pwd" value={pwd} />
              <img ref={visibilityRef} onClick={handleVisibility} className='w-8 mr-2 cursor-pointer' src={assets.closedeye} alt="" />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <button className='mt-6 h-10 flex justify-center items-center bg-green-600 text-white w-full border-none rounded-md p-2' type="submit">Login</button>
            
            <Link to={'/signin'} >
              <p>New User? <span className='underline cursor-pointer'>Sign In</span> </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login