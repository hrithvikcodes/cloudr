import React from 'react'

function RecentCard({ name, duration, size, onPlayClick }) {
  return (
    <div className='flex flex-row items-center justify-between w-full h-full p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg gap-2'>
      
      <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
        <button onClick={onPlayClick}>
        <i className='fa-solid fa-play text-[#ff7a00] text-2xl sm:text-4xl shrink-0 cursor-pointer'></i>
        </button>
        <span className='text-white text-lg sm:text-2xl font-medium truncate'>
          {name}
        </span>
      </div>

      <div className='flex flex-row items-center gap-2 sm:gap-4 text-zinc-500 text-sm sm:text-xl font-medium font-sans shrink-0'>
        <span>{duration}</span>
        <span>•</span>
        <span>{size}</span>
      </div>

    </div>
  )
}
 
export default RecentCard