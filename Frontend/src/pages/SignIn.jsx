import React from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center text-xl'>
      <div className='p-4 rounded-lg flex flex-col gap-8 justify-center items-center text-center w-full h-full md:w-1/3 md:h-96 md:border md:border-black'>
        
          <div className='font-bold text-3xl'>
            <h1>SignIn</h1>
          </div>

        <form action="/incomeInfo" method="post">
          <div className='flex flex-col justify-center gap-1 text-start'>
            <label htmlFor="username">Username</label>
            <input className='border border-black p-2 h-8' type="text" name="username" id="username" />
            <label htmlFor="email">Email</label>
            <input className='border border-black p-2 h-8' type="email" name="email" id="email" />
            <label htmlFor="pwd">Password</label>
            <input className='border border-black p-2 h-8' type="password" name="pwd" id="pwd" />
          </div>

          <div className='flex flex-col gap-2 mb-4'>
            <button className='mt-4 h-10 flex justify-center items-center bg-green-600 text-white w-full border-none rounded-md p-2' type="submit">Login</button>
            
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