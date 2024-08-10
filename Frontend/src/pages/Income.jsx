import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../Context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Income = () => {

  const { regUserId, setUserIncome, authState } = useContext(UserContext);
  const [income, setIncome] = useState('');
  const [date, setDate] = useState('');
  const [interval, setInterval] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();

    const jsDate = new Date(date);
    console.log(jsDate.toISOString());
    console.log(jsDate);
    

    const incomeInfo = {
      userId: regUserId,
      income: income,
      incomeDateInterval:{
        startDate: jsDate,
        interval: interval
      }
    }

    setUserIncome(income);

    try {

      const submitIncomeInfo = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/income`, incomeInfo);
      console.log(submitIncomeInfo);
      
      navigate('/spendwise')
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    if(!authState){
      navigate('/signin');
    }
  }, [authState]);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='flex flex-col justify-between border text-3xl p-8 gap-8 rounded-lg' action="" method="post">
        <div className='flex flex-col  gap-4'>
          <label htmlFor="income">Monthly Income</label>
          <input onChange={(e)=>{setIncome(e.target.value)}} className='border border-black rounded-md p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="income" id="income" value={income} />
        </div>

        <div className='flex flex-col  gap-4'>
          <label htmlFor="startDate">Pay-Day</label>
          <input onChange={(e)=>{setDate(e.target.value)}} className='border border-black rounded-md p-1' type="date" name="startDate" id="startDate" value={date} />
        </div>

        <div className='flex flex-col  gap-4'>
          <label htmlFor="interval">Interval</label>
          <input onChange={(e)=>{setInterval(e.target.value)}} className='border border-black rounded-md p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="interval" id="interval" value={interval} />
        </div>

        <button className='border border-black rounded-md p-2 bg-green-600 text-white border-none' type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Income