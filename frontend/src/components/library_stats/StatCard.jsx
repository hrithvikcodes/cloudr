import React from 'react'

function StatCard({stat, num, icon}) {
  return (
    <div className='flex flex-row items-center justify-between w-full p-5 bg-zinc-900 border border-zinc-800 rounded-3xl gap-4 shadow-lg'>
      <div className='flex flex-col gap-1'>
        <span className='text-zinc-400 text-xs sm:text-sm font-medium tracking-wide uppercase'>{stat}</span>
        <h2 className='text-white text-2xl sm:text-3xl font-bold'>{num}</h2>
      </div>
      <div className='flex items-center justify-center p-3 bg-zinc-800/50 rounded-2xl shrink-0'>
        <i className={`${icon} text-xl text-[#ff7a00]`}></i>
      </div>
    </div>
  )
}

export default StatCard