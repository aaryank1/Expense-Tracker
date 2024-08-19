import React, { useRef, useState } from 'react'
import { useContext, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, Title, ArcElement, Tooltip, Legend, plugins } from 'chart.js' 
import { Doughnut } from 'react-chartjs-2'
import { assets } from '../assets/assets';
import ExpenseModal from './AddExpenseModal';
import axios from 'axios';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import EditExpenseModal from './EditExpenseModel';
import DeleteExpenseModal from './DeleteExpenseModal';
import Dropdown from './Dropdown';
import EditIncomeModal from './EditIncomeModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
)

const Home = () => {
  const { authState, regUserId, setRegUserId, userIncome, setUserIncome } = useContext(UserContext)
  const navigate = useNavigate();
  
  const [ham, setHam] = useState(false);
  const imgRef = useRef();
  const menuRef = useRef();

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openModIncome, setOpenModIncome] = useState(false);

  const [expenseData, setExpenseData] = useState([]);
  const [expenseId, setExpenseId] = useState('');
  const [totalExpense, setTotalExpense] = useState('');

  const [categoryData, setCategoryData] = useState([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const [userIncomeId, setUserIncomeId] = useState('');
  const [income, setIncome] = useState('');
  const [startDate, setStartDate] = useState('');

  const [loading, setLoading] = useState(false);

  const doughnutRef = useRef();

  const categories = ['Essentials', 'Entertainment', 'Education', 'Housing', 'HealthCare', 'Clothing', 'Personal Care', 'Investments', 'Miscellaneous'];

  // console.log(authState);  

   const fetchExpenses = async () => {
    
      try {
        const expenses = await axios.get(`${import.meta.env.VITE_SERVER_URL}/spendwise/expenses`, {
          params: { userId: regUserId }
        });
        setExpenseData(expenses.data);
        {regUserId && filterExpenses()};
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

    const fetchTotalExpense = async () => {
      try{
        const userId = localStorage.getItem('validUserAuth');
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/spendwise/total/expense`, {
          params: { userId: userId }
        });
        // console.log(response.data[0].totalExpense);
        setTotalExpense(response.data[0].totalExpense);
      }
      catch(error){
        // console.log(error);
      }
    }

    const fetchIncome = async () =>{
      try{
        const userId = localStorage.getItem('validUserAuth');
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/income/${userId}`);

        const date = new Date(response.data.startDate)
        const formatDate = date.toISOString().split('T')[0];
        setUserIncomeId(response.data._id);
        setIncome(response.data.income);
        setStartDate(formatDate);
        setUserIncome(response.data.income);
      }
      catch(error){
        console.log(error);
      }
    }

    const editIncome = async (e)=>{
      setLoading(true);
      e.preventDefault();
      setOpenModIncome(false);

      const incomeId = userIncomeId;
      
      const jsDate = new Date(startDate)

      const updateIncomeData = {
        income: income,
        startDate: jsDate,
      }

      try{        
        const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/user/income/${incomeId}`, updateIncomeData);
        fetchIncome();
        fetchTotalExpense();
        toast.success("Income Modified Successfully");
      }
      catch(error){
        toast.error("Error Modifying Income")
        console.log(error);
      }
      setLoading(false);
    }

  useEffect(()=>{
    setLoading(true);
    fetchExpenses();
    fetchIncome();
    setLoading(false);
    if(expenseData){
      fetchTotalExpense();
    }
  }, [])

  useEffect(()=>{
    if(!authState){
      navigate('/')
    }
  }, [authState])

  const handleHamburg = () => {
    setHam(false);
  }

  const handleIncomeMod = () => {
    setOpenModIncome(true)
  }

  window.addEventListener('click', (e)=>{
    if(e.target !== menuRef.current && e.target!== imgRef.current){
      setHam(false);
    }
  })

  const handleExpense = async (e) => {

    e.preventDefault();

    if(!category){
      alert("Please enter a Category for your Expense")
      return;
    }

    setLoading(true);

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
      fetchTotalExpense();
      {regUserId && filterExpenses()};

    } catch (error) {
      toast.error("Error Adding Expense")
      console.log(error);
    }

    setLoading(false);
  }

  const handleDownload = async () => {
    setLoading(true);
    const doc = new jsPDF();

    const canvas = html2canvas(doughnutRef.current);
    const imgData = (await canvas).toDataURL('image/png')

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold'); // Set font to bold

    // Title text
    const title = 'Expense Report';

    // Calculate the x-coordinate to center the title
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;

    // Add title to PDF
    doc.text(title, x, 22); // Centered title

    const underlineY = 24; // Y-coordinate for the underline (just below the text)
    const margin = 10; // Margin on the left side
    doc.setLineWidth(0.5); // Line width for the underline
    doc.line(x - margin, underlineY, x + textWidth + margin, underlineY);

    doc.addImage(imgData, 'PNG', 8, 30, 190, 100);

    doc.autoTable({
      startY: 160,
      head: [['Date', 'Description', 'Amount']],
      body: expenseData.map(expense => [expense.title, expense.category, `INR ${expense.amount}`])
    });

    doc.save('expense-report.pdf');
    setLoading(false);
  }

  const handleEdit = async (e) => {
    setLoading(true);
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
      regUserId && filterExpenses();
      fetchTotalExpense();
      setTitle('')
      setCategory('')
      setAmount('')
      setOpenEdit(false);
    } catch (error) {
      toast.error("Error Modifying the Expense")
      console.log(error);
    }

    setLoading(false);
  }

  const handleDelete = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      
      const deleteExpense = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/spendwise/expense/${expenseId}`);
      setOpenDelete(false);
      toast.success("Expense Deleted Successfully");
      fetchExpenses();
      regUserId && filterExpenses();
      fetchTotalExpense();
    } catch (error) {
      toast.error("Error Deleting the Expense")
      console.log(error);
    }

    setLoading(false);
  }


  const categoryTotals = categories.map(category => {
    const categoricalData = categoryData.find(item => item._id===category);

    return categoricalData ? categoricalData.totalAmount : 0;
  })

  const data = {
    labels: categories,
    datasets: [{
      label: 'Expense',
      data: categoryTotals,
      backgroundColor: ['#4A90E2', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#F6C23E', '#E74A3B', '#5A9BD4', '#9B59B6'],
      hoverOffset: 10,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels:{
          font: {
            size: 15
          },
        }
      }
    }
  }

  return loading ? (
    <div className='w-full h-full flex justify-center items-center'>
        <div className='w-16 h-16 bg-white border-t-4 border-green-400 animate-spin rounded-full'></div>
      </div>
    ): (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex items-center justify-between gap-8 bg-gray-500 w-full h-16'>
        <img className='w-40 h-full' src={assets.logo} alt="" />
        <img ref={imgRef} onClick={()=>setHam(!ham)} className='w-12 h-12 mr-4 p-2 cursor-pointer hover:bg-slate-600' src={assets.hamburger} alt="" />
        { ham && <Dropdown ref={menuRef} handleCloseOpts={handleHamburg} handleMod={handleIncomeMod} />}
      </div>

      <EditIncomeModal openModIncome={openModIncome} onClose={()=>setOpenModIncome(false)}>
        { loading ? (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='w-16 h-16 bg-white border-t-4 border-green-400 animate-spin rounded-full'></div>
          </div>
        ): 
        <form onSubmit={editIncome} className='flex flex-col justify-between border text-3xl p-8 gap-8 rounded-lg' method="patch">
          <div className='flex flex-col gap-4'>
            <label htmlFor="income">Monthly Income</label>
            <input onChange={(e)=>{setIncome(e.target.value)}} className='border border-black rounded-md p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' type="number" name="income" id="income" value={income} />
          </div>

          <div className='flex flex-col gap-4'>
            <label htmlFor="startDate">Pay-Day</label>
            <input onChange={(e)=>{setStartDate(e.target.value)}} className='border border-black rounded-md p-1' type="date" name="startDate" id="startDate" value={startDate} />
          </div>

          <button className='border border-black rounded-md p-2 bg-green-600 text-white border-none' type="submit">Submit</button>
        </form>}
      </EditIncomeModal>
      
      <h1 className='font-bold text-3xl'>Expense Analysis</h1>

      <div className='w-full flex justify-evenly items-center'>
        <div ref={doughnutRef} className='w-full sm:w-4/5 md:w-3/5 flex justify-center lg:justify-between items-center'>
          <Doughnut className='w-full'
            data={data}
            options = {options}
          >
          </Doughnut>
          
        </div>
        <div className='hidden flex-col gap-4 lg:flex text-lg justify-center items-center bg-lime-200 p-6 rounded-xl'>
          
          <h1 className='font-bold text-2xl underline'>Expenditures</h1>
          
          <h1 className=' bg-orange-200 px-4 py-2 rounded-full w-full'>Monthly Income : <span className='font-bold'>{userIncome}</span></h1>

          <h1 className=' bg-orange-200 px-4 py-2 rounded-full w-full'>Total Money Spent : <span className='font-bold'>{totalExpense}</span></h1>

          <h1 className=' bg-orange-200 px-4 py-2 rounded-full w-full'>Expenditure : <span className='font-bold'>{totalExpense/userIncome * 100}%</span></h1>

        </div>
      </div>

      <div className='w-full flex justify-evenly items-center gap-4 px-4 py-2 rounded-3xl text-white border-none'>
        <button className='text-xl px-4 py-2 rounded-full bg-green-600' onClick={()=>setOpen(true)} type="button">Add Expense</button>
        <ExpenseModal open={open} onClose={() => setOpen(false)}>
          <div className='w-full flex flex-col gap-8 items-center' >
            <div className='flex flex-col gap-4 items-center'>
            <img className='w-20 mt-4' src={assets.expense} alt="" />
            <h1 className='text-3xl font-bold'>Add Expense</h1>
            </div>

            {  loading ? (
                <div className='w-full h-full flex justify-center items-center'>
                  <div className='w-16 h-16 bg-white border-t-4 border-green-400 animate-spin rounded-full'></div>
                </div>
              ): 
            
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

            </form>}

          </div>
        </ExpenseModal>

        <div>
          <button onClick={handleDownload} className='flex bg-red-500 px-4 py-2 gap-2 rounded-full text-black justify-center items-center font-semibold' type='button'>
            <img className='w-6' src={assets.download} alt="" />
            Download Report
          </button>
        </div>
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


                { loading ? (
                  <div className='w-full h-full flex justify-center items-center'>
                    <div className='w-16 h-16 bg-white border-t-4 border-green-400 animate-spin rounded-full'></div>
                  </div>
                ): 
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

                </form>}
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

                { loading ? (
                  <div className='w-full h-full flex justify-center items-center'>
                    <div className='w-16 h-16 bg-white border-t-4 border-green-400 animate-spin rounded-full'></div>
                  </div>
                ): 
                <form onSubmit={handleDelete} className='flex flex-col text-center' method='delete'>

                  <p className='text-xl text-gray-500'>Are You Sure You Wish To Delete this Expense?</p>

                  <div className='flex justify-evenly w-full items-center mt-4 font-bold'>
                    <button onClick={()=>{setOpenDelete(false);
                      setExpenseId('');
                    }} className='bg-gray-400 px-6 py-3 rounded-lg' type='button'>Cancel</button>
                    <button className='bg-red-600 px-6 py-3 rounded-lg' type='submit'>Delete</button>
                  </div>

                </form>}

              </div>
            </DeleteExpenseModal>
          </div>

        </div>)
      )}

    </div>
  )
}

export default Home