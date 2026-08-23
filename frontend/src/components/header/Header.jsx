import React from 'react'
import StorageCard from './storage/StorageCard.jsx'
import QuickAction from './quick_actions/QuickAction.jsx'

function Header({token}) {
  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h2 className='text-white text-3xl sm:text-4xl font-medium'>Home</h2> 
        <div className='hidden flex flex-row items-center bg-zinc-800 rounded-2xl w-full sm:w-auto px-2'>
            <i className="fa-solid fa-magnifying-glass  text-zinc-400 text-xl ml-2"></i>
            /*<input placeholder='Search....' className='text-white p-3 w-full sm:w-72 text-lg border-none bg-zinc-800 rounded-2xl outline-none'></input>
        </div>
      </div>

      <div>
        <h3 className='text-zinc-400 font-medium text-2xl sm:text-4xl'>
            Welcome Back!
        </h3>
      </div>

      
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 w-full'>
        <StorageCard token={token}/>
        <QuickAction />
      </div>
    </div>
  )
}

export default Header