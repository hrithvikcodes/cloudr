import React from 'react'
import QuickActionButtons from './QuickActionButtons.jsx'

function QuickAction() {
  return (
    <div className="w-full">
        <h3 className='flex flex-row text-2xl md:text-3xl font-medium text-white'>Quick Actions</h3>
        <div className='flex flex-row justify-between w-full gap-3 mt-4 md:mt-6 rounded-2xl'>
            <QuickActionButtons action={"Upload"}/>
            <QuickActionButtons action={"Playlist"}/>
        </div>
    </div>
  )
}

export default QuickAction
