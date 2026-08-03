import React from 'react'
import RecentCard from './RecentCard.jsx'

function Recent() {
  return (
    <div className='flex flex-col p-4 sm:p-6'>
        <h3 className='text-2xl sm:text-3xl font-medium text-white mb-6'>Recent</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full'>
            <div className='h-auto sm:h-[12vh] w-full'>
                <RecentCard name="Iktara" duration="3:02" size="3MB"/>
            </div>

            <div className='h-auto sm:h-[12vh] w-full'>
                <RecentCard name="Phir Kabhi" duration="5:45" size="6MB"/>
            </div>
        </div>
    </div>
  )
}

export default Recent