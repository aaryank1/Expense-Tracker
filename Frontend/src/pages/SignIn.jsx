import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets.js'
import axios from 'axios'
import { debounce } from 'lodash'
import { UserContext } from '../Context/UserContext.jsx'

const SignIn = () => {

  const navigate = useNavigate();
  const {setUserName, setRegUserId, authState, setAuthState} = useContext(UserContext)

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setpwd] = useState("");
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [error, setError] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const pwdRef = useRef();
  const visibilityRef = useRef();
  const usernameErrorRef = useRef();
  const emailErrorRef = useRef();


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

  const validateEmail = async (email)=>{
    try {
      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${import.meta.env.VITE_EMAIL_VALIDATION_API_KEY}&email=${email}`);

      response.data.deliverability === "DELIVERABLE" ? setValidEmail(true) : setValidEmail(false);
    } catch (error) {
      console.log(error);
      setValidEmail(false);
    }
  }

  const debounceValidEmail = useCallback(debounce((email) => validateEmail(email), 800), []);

  useEffect(()=>{
    if(email){
      debounceValidEmail(email);
    }
  }, [email, debounceValidEmail]);

  // useEffect(() => {
  //   localStorage.setItem('authToken', authState);
  // }, [authState]);

  useEffect(() => {
    const checkLocalStorage = localStorage.getItem('validUserAuth')
    if(checkLocalStorage){
        setRegUserId(checkLocalStorage);
        setAuthState(true);
        navigate('/spendwise')
    }
  })

  const handleSubmit = async (e)=> {
    e.preventDefault();
    // console.log(validEmail);
    
    if(validEmail){

      const userData = {
        username: username,
        email: email,
        password: pwd
      }

      try {
        const registerUser = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/register`, userData);
        // console.log(registerUser.data);
        
        if(registerUser.data.success){
          setMessage(registerUser.data.message);
          setUserName(username);
          setRegUserId(registerUser.data.userId);
          setAuthState(true);
          localStorage.setItem('validUserAuth', registerUser.data.userId);
          navigate('/incomeInfo')
        }
        else{
          alert(registerUser.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    else{
      alert("Invalid Email Address.");
    }
    
  }

  return (
    <div className='w-full h-screen flex justify-center items-center text-xl'>
      <div className='p-4 rounded-lg flex flex-col gap-8 justify-center items-center text-center w-full h-full md:w-1/3 md:h-96 md:border md:border-black'>
        
          <div className='font-bold text-3xl'>
            <h1>SignIn</h1>
          </div>

        <form onSubmit={handleSubmit} action="/incomeInfo" method="post">
          <div className='flex flex-col justify-center gap-1 text-start'>
            <label htmlFor="username">Username</label>
            <input onChange={(e) => {setUsername(e.target.value)}} className='border border-black p-2 h-8' type="text" name="username" id="username" required value={username} />
            
            <label htmlFor="email">Email</label>
            <input onChange={(e) => {setEmail(e.target.value)}} className='border border-black p-2 h-8' type="email" name="email" id="email" required value={email} />
            
            <div className='flex flex-col'>
            <label htmlFor="pwd">Password</label>
              <div className='flex gap-1 border border-black p-1'>
                <input ref={pwdRef} onChange={(e) => {setpwd(e.target.value)}} className=' outline-none p-2 h-8' type="password" name="pwd" id="pwd" required value={pwd} />
                <img ref={visibilityRef} onClick={handleVisibility} className='w-8 mr-2 cursor-pointer' src={assets.closedeye} alt="" />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 mb-4'>
            <button className='mt-4 h-10 flex justify-center items-center bg-green-600 text-white w-full border-none rounded-md p-2' type="submit">SignIn</button>
            
            <Link to={'/'} >
              <p>Already A User? <span className='underline cursor-pointer'>Log In</span> </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn