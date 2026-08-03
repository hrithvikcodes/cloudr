import React from 'react'

function QuickActionButtons({action}) {
  return (
    <div className='flex flex-row items-center text-white cursor-pointer justify-center text-base sm:text-2xl font-medium gap-2 sm:gap-4 h-14 sm:h-16 flex-1 min-w-0 rounded-2xl p-3 bg-zinc-800'>
        <i className="fa-solid fa-plus text-white text-lg sm:text-3xl bg-[#ff7a00] p-1.5 sm:p-0 rounded-lg sm:rounded-none shrink-0"></i>
        <h3 className='truncate'>{action}</h3>
    </div>
  )
}

export default QuickActionButtons
