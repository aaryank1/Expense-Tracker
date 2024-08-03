import React, { useState } from 'react'
import '../styles/login.css'

const Login = () => {

    const [signIn, setSignIn] = useState(false);

  return (
    <div className='login_page'>
            <div className="card">
                <div className="title">{ signIn ? <h1>Sign In</h1> : <h1>Log In</h1>}</div>
                <form action="/submit/user" className='form' method='post'>
                
                    <label htmlFor="email" className='email_label'>Email</label>
                    <input type="email" name="email" id="email" />

                    <label htmlFor="pwd" className='pwd_label'>Password</label>
                    <input type="password" name="pwd" id="pwd" />

                    <button type="submit" className='submit_btn'>Submit</button>

                </form>
            </div>
    </div>
  )
}

export default Login