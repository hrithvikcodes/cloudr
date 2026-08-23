import React from 'react'
import QueueStatus from './QueueStatus.jsx'

function statusLabel(status) {
  switch (status) {
    case 'uploading': return 'Uploading...';
    case 'done': return 'Done';
    case 'error': return 'Failed';
    default: return status;
  }
}

function QueueCard({upload}) {
  return (
    <div className='flex flex-col mt-6 w-full min-w-0 max-h-[20rem] bg-zinc-900 rounded-3xl p-2 sm:p-0'>
        <h2 className='text-white text-2xl sm:text-3xl p-4'>Queue</h2>

        <div className='flex flex-col gap-4 sm:gap-6 overflow-y-auto no-scrollbar px-2 pb-4 min-w-0'>
          {
            upload.map((item)=> {
              return <QueueStatus key={item.id} name={item.title} progress={statusLabel(item.status)}/>
            })
          }
        </div>
    </div>
  )
}

export default QueueCard