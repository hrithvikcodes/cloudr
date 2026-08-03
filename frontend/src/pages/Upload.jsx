import React, { useState } from 'react'
import StorageCard from '../components/header/storage/StorageCard'
import QueueCard from '../components/queue/QueueCard'
import SmartClassifyToggle from '../components/smart_classify/SmartClassifyToggle'

function Upload() {
  const [smartClassify, setSmartClassify] = useState(false)

  return (
    <div className='flex flex-col gap-6 pb-36'>
      {/* Header & Smart Classify Toggle */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h2 className='text-white text-3xl sm:text-5xl font-medium'>Upload</h2>
        <SmartClassifyToggle enabled={smartClassify} setEnabled={setSmartClassify} />
      </div>

      {/* Upload Drop Zone */}
      <div className='flex flex-col min-h-[16rem] sm:min-h-[20rem] py-12 w-full bg-zinc-900 rounded-3xl justify-center items-center'>
        <div className='flex flex-col gap-4 sm:gap-6 p-4 items-center justify-center text-center'>
          <i className="fa-solid fa-cloud-arrow-up text-zinc-400 text-6xl sm:text-9xl mt-4"></i>
          <h2 className='text-white font-medium text-xl sm:text-3xl'>Drop your audio files here</h2>
          <p className='text-[#ff7a00] text-lg sm:text-2xl font-medium cursor-pointer'>or Click to browse</p>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10'>
        <div className='flex-1 min-w-0'>
          <StorageCard />
        </div>
        <div className='flex-1 min-w-0'>
          <QueueCard />
        </div>
      </div>
    </div>
  )
}

export default Upload
