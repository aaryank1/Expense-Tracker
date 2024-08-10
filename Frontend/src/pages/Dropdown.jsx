import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

const Dropdown = React.forwardRef((props, menuRef) => {
    const { setAuthState } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        props.handleCloseOpts;
        localStorage.removeItem('validUserAuth');
        setAuthState(false);        
    }

    const handleIncomeMod = () =>{
      props.handleCloseOpts
      props.handleMod()
    }

  return (
    <div ref={menuRef} className="flex flex-col absolute right-4 top-14 bg-white p-4 font-bold  rounded-lg shadow-2xl border border-gray-400 before:absolute before:-top-2 before:content-[''] before:right-4 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border before:border-t-gray-400 before:border-l-gray-400 before:border-r-transparent before:border-b-transparent">
        <ul className='flex flex-col gap-4 text-center '>
            <li onClick={handleIncomeMod} className='hover:bg-slate-200 duration-150 px-4 py-1 rounded-lg cursor-pointer'>Modify Income</li>
            <li><button onClick={handleLogout} className='bg-red-500 hover:bg-red-400 duration-150 px-4 py-1 rounded-lg text-white' type="button">Logout</button></li>
        </ul>
    </div>
  )
})

export default Dropdown