import React from 'react'

function SmartClassifyToggle({ enabled, setEnabled }) {
  return (
    <div className='flex flex-row items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 px-4 sm:px-6 py-4 rounded-2xl w-full'>
        <div className='flex flex-col'>
            <span className='text-white font-medium text-lg sm:text-xl'>Smart Classify</span>
            <span className='text-zinc-400 text-sm sm:text-lg'>Auto classifies artists</span>
        </div>

        <button
          type='button'
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? 'bg-[#ff7a00]' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
              enabled ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
    </div>
  )
}

export default SmartClassifyToggle