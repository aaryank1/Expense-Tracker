import React, { useRef, useState } from 'react'
import { useContext, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, Title, ArcElement, Tooltip, Legend } from 'chart.js' 
import { Doughnut } from 'react-chartjs-2'
import { assets } from '../assets/assets';
import ExpenseModal from './AddExpenseModal';
import axios from 'axios';
import { toast } from 'react-toastify'
import EditExpenseModal from './EditExpenseModel';
import DeleteExpenseModal from './DeleteExpenseModal';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
)

const Home = () => {
  const { authState, regUserId, userExpenseData } = useContext(UserContext)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [expenseData, setExpenseData] = useState([]);
  const [expenseId, setExpenseId] = useState('');

  const [categoryData, setCategoryData] = useState([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const categories = ['Essentials', 'Entertainment', 'Education', 'Housing', 'HealthCare', 'Clothing', 'Personal Care', 'Investments', 'Miscellaneous'];

  // console.log(authState);  

   const fetchExpenses = async () => {
    
      try {
        const expenses = await axios.get(`${import.meta.env.VITE_SERVER_URL}/spendwise/expenses`, {
          params: { userId: regUserId }
        });
        setExpenseData(expenses.data);
        filterExpenses();
      } 
      catch (error) {
        console.log(error);
      }
    }

    const filterExpenses = async () => {
      try{
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/spendwise/category/expenses?userId=${regUserId}`);
        setCategoryData(response.data);
        // console.log(response.data);
      }
      catch(error){
        console.log(error);
      }
    }

  useEffect(()=>{
    fetchExpenses();
  }, [])

  useEffect(()=>{
    if(!authState){
      navigate('/')
    }
  }, [authState])

  const categoryTotals = categories.map(category => {
    const categoricalData = categoryData.find(item => item._id===category);

    return categoricalData ? categoricalData.totalAmount : 0;
  })

  const handleHamburg = () => {

  }

  const handleExpense = async (e) => {

    e.preventDefault();

    if(!category){
      alert("Please enter a Category for your Expense")
      return;
    }

    const userInput = {
      userId: regUserId,
      title: title,
      category: category,
      amount: amount
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/spendwise/expense/${regUserId}`, userInput);
      toast.success(`${response.data}`, {position: "top-right"});
      setTitle('');
      setCategory('');
      setAmount('');
      setOpen(false);
      fetchExpenses();
      filterExpenses();

    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async (e) => {
    try {
      e.preventDefault();
      const editData = {
        title: title,
        category: category,
        amount: amount
      }
      const edit = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/spendwise/expense/${expenseId}`, editData);
      // console.log(edit.data);
      toast.success("Expense Editted Successfully");
      fetchExpenses();
      filterExpenses();
      setTitle('')
      setCategory('')
      setAmount('')
      setOpenEdit(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      
      const deleteExpense = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/spendwise/expense/${expenseId}`);
      setOpenDelete(false);
      toast.success("Expense Deleted Successfully");
      fetchExpenses();
      filterExpenses();
    } catch (error) {
      console.log(error);
    }
  }



  const data = {
    labels: categories,
    datasets: [{
      label: 'Expense',
      data: categoryTotals,
      backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#F6C23E', '#E74A3B', '#5A9BD4', '#9B59B6'],
      borderColor: ['#4A90E2', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#F6C23E', '#E74A3B', '#5A9BD4', '#9B59B6'],
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex items-center justify-between gap-8 bg-gray-500 w-full h-16'>
        <img className='w-40 h-full' src={assets.logo} alt="" />
        <img onClick={handleHamburg} className='w-8 h-8 mr-4' src={assets.hamburger} alt="" />
      </div>

      <div className='w-full flex justify-center md:w-3/5 md:h-4/5'>
        <Doughnut className='w-full'
          data={data}
          options = {options}
        >
        </Doughnut>
      </div>

      <div className='flex justify-center items-center bg-green-600 px-4 py-2 rounded-3xl text-white border-none'>
        <button onClick={()=>setOpen(true)} type="button">Add Expense</button>
        <ExpenseModal open={open} onClose={() => setOpen(false)}>
          <div className='w-full flex flex-col gap-8 items-center' >
            <div className='flex flex-col gap-4 items-center'>
            <img className='w-20 mt-4' src={assets.expense} alt="" />
            <h1 className='text-3xl font-bold'>Add Expense</h1>
            </div>

            <form onSubmit={handleExpense} className='flex flex-col gap-6 text-2xl' method="post">

              <div className='flex flex-col gap-1'>
                <label htmlFor="title">Title</label>
                <input onChange={(e) => {setTitle(e.target.value)}} className='border border-black p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="text" name='title' id='title' value={title} />
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor="category">Category</label>
                <select onChange={(e) => {setCategory(e.target.value)}} className='border text-center' name="category" id="category" value={category}>
                  <option className='text-gray-400' value="">----Select----</option>
                  <option value="Essentials">Essentials</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Housing">Housing</option>
                  <option value="HealthCare">HealthCare</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Investments">Investments</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor="amount">Amount</label>
                <input onChange={(e) => {setAmount(e.target.value)}} className='border border-black p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name='amount' id='amount' value={amount} />
              </div>

              <div className='flex gap-4 justify-evenly items-center mt-4'>
                <button onClick={()=>setOpen(false)} className='text-white bg-red-600 px-4 py-2 rounded-lg' type='button'>Cancel</button>
                <button className='text-white bg-green-600 px-4 py-2 rounded-lg' type="submit">Submit</button>
              </div>

            </form>

          </div>
        </ExpenseModal>
      </div>

      <div className='grid grid-cols-4 justify-items-center items-center p-2 text-2xl font-bold gap-4 w-full'>
        <p>Title</p>
        <p>Category</p>
        <p>Amount</p>
        <p>Actions</p>
      </div>

      {expenseData.map((expense, index) => 
         (<div key={index} className='grid grid-cols-4 p-2 items-center gap-4 w-full bg-lime-200 rounded-xl'>
          <p className='flex justify-center items-center text-center'>{expense.title}</p>
          <p className='flex justify-center items-center text-center'>{expense.category}</p>
          <p className='flex justify-center items-center text-center'>{expense.amount}</p>

          

          <div className='flex flex-row justify-center items-center gap-8'>
            <img onClick={()=>{
              setOpenEdit(true);
              setTitle(expense.title);
              setCategory(expense.category)
              setAmount(expense.amount)
              setExpenseId(expense._id);
              }} className='w-8 cursor-pointer' src={assets.edit} alt="" />

            <EditExpenseModal openEdit={openEdit} onClose={() => {setOpenEdit(false);setTitle('');
              setCategory('');
              setAmount('');
              setExpenseId('');}}>
              <div className='w-full flex flex-col gap-8 items-center' >
                <div className='flex flex-col gap-4 items-center'>
                <img className='w-20 mt-4' src={assets.edit} alt="edit" />
                <h1 className='text-3xl font-bold'>Edit Expense</h1>
                </div>


                <form onSubmit={handleEdit} className='flex flex-col gap-6 text-2xl' method='patch'>

                  <div className='flex flex-col gap-1'>
                    <label htmlFor="title">Title</label>
                    <input onChange={(e) => {setTitle(e.target.value)}} className='border border-black p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="text" name='title' id='title' value={title} />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label htmlFor="category">Category</label>
                    <select onChange={(e) => {setCategory(e.target.value)}} className='border text-center' name="category" id="category" value={category}>
                      <option className='text-gray-400' value="">----Select----</option>
                      <option value="Essentials">Essentials</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Education">Education</option>
                      <option value="Housing">Housing</option>
                      <option value="HealthCare">HealthCare</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Investments">Investments</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label htmlFor="amount">Amount</label>
                    <input onChange={(e) => {setAmount(e.target.value)}} className='border border-black p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name='amount' id='amount' value={amount} />
                  </div>

                  <div className='flex gap-4 justify-evenly items-center mt-4'>
                    <button onClick={()=>{setOpenEdit(false);
                      setTitle('');
                      setCategory('');
                      setAmount('');
                    }} className='text-white bg-red-600 px-4 py-2 rounded-lg' type='button'>Cancel</button>
                    <button className='text-white bg-green-600 px-4 py-2 rounded-lg' type="submit">Submit</button>
                  </div>

                </form>
              </div>
            </EditExpenseModal>
            <img onClick={() => {
              setExpenseId(expense._id);
              setOpenDelete(true);
              }} className='w-8 cursor-pointer' src={assets.bin} alt="" />
            <DeleteExpenseModal openDelete = {openDelete} onClose={()=> setOpenDelete(false)}>
              <div className='w-full flex flex-col gap-8 items-center'>
                <div className='flex flex-col gap-4 items-center'>
                  <img className='w-20 mt-4' src={assets.bin} alt="bin" />
                  <h1 className='text-3xl font-bold'>Delete Expense</h1>
                </div>

                <form onSubmit={handleDelete} className='flex flex-col text-center' method='delete'>

                  <p className='text-xl text-gray-500'>Are You Sure You Wish To Delete this Expense?</p>

                  <div className='flex justify-evenly w-full items-center mt-4 font-bold'>
                    <button onClick={()=>{setOpenDelete(false);
                      setExpenseId('');
                    }} className='bg-gray-400 px-6 py-3 rounded-lg' type='button'>Cancel</button>
                    <button className='bg-red-600 px-6 py-3 rounded-lg' type='submit'>Delete</button>
                  </div>

                </form>

              </div>
            </DeleteExpenseModal>
          </div>

        </div>)
      )}

    </div>
  )
}

export default Home