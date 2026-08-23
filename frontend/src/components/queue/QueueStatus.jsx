import React from 'react'

function progressColor(progress) {
  if (progress === 'Uploading...') return 'text-orange-500';
  if (progress === 'Failed') return 'text-red-500';
  return 'text-zinc-400';
}

function QueueStatus({name, progress}) {
  return (
    <div className='flex flex-row justify-between sm:justify-start gap-4 sm:gap-8 p-2 min-w-0'>
        <h3 className='text-white text-lg sm:text-2xl font-medium truncate min-w-0'>{name}</h3>
        <h3 className={`text-lg sm:text-2xl font-medium shrink-0 ${progressColor(progress)}`}>{progress}</h3>    
    </div>
  )
}

export default QueueStatus