import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import Income from './pages/Income'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/incomeInfo' element={<Income />} />
        <Route path='/spendwise' element={<Home />} />
        {/* <Route path='/login' element={<Settings />} /> */}

      </Routes>
    </div>
  )
}

export default App