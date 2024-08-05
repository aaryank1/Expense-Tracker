import React from 'react'
import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<Login />} />
      <Route path='/signin' element={<SignIn />} />
      {/* <Route path='/login' element={<Home />} />
      <Route path='/login' element={<Settings />} /> */}

    </Routes>
  )
}

export default App