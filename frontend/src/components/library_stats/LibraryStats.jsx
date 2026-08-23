import React from 'react'
import StatCard from './StatCard.jsx'

function LibraryStats(likedCount, songs, artists, playlists) {
  return (
    <div className='flex flex-col w-full'>
        <h3 className='text-2xl sm:text-3xl font-medium text-white mb-4'>Library Stats</h3>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            <StatCard num={`${artists || 0}`} stat={"Artists"} icon={"fa-solid fa-user"}/>
            <StatCard num={`${playlists || 0}`} stat={"Playlists"} icon={"fa-solid fa-music"}/>
            <StatCard num={`${likedCount || 0}`} stat={"Liked"} icon={"fa-solid fa-heart"}/>
            <StatCard num={`${songs || 0}`} stat={"Songs"} icon={"fa-solid fa-music"}/>
        </div>
    </div>
  )
}

export default LibraryStats