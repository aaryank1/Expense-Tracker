import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import Income from './pages/Income'

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<Login />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/incomeInfo' element={<Income />} />
      <Route path='/home' element={<Home />} />
      {/* <Route path='/login' element={<Settings />} /> */}

    </Routes>
  )
}

export default App