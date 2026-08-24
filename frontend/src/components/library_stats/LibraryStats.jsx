import React, { useEffect, useState } from 'react'
import StatCard from './StatCard.jsx'
import { API_URL } from '../../api.js';

function LibraryStats({token}) {

  const [songCount, setSongCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);

  useEffect(()=> {
    const fetchCounts = async () => {
      try {
        const [songsRes, likedRes] = await Promise.all([
          fetch(`${API_URL}/songs/count/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${API_URL}/liked/count`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);
        const songsData = await songsRes.json();
        const likedData = await likedRes.json();
        setSongCount(songsData.count);
        setLikedCount(likedData.count);
      } catch (error) {
        console.error("Error fetching library stats", error);
      }
    };

    if (token) fetchCounts();
  }, [token]);
  return (
    <div className='flex flex-col w-full'>
        <h3 className='text-2xl sm:text-3xl font-medium text-white mb-4'>Library Stats</h3>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
            <StatCard num={``} stat={"Artists"} icon={"fa-solid fa-user"}/>
            <StatCard num={``} stat={"Playlists"} icon={"fa-solid fa-music"}/>
            <StatCard num={`${likedCount}`} stat={"Liked"} icon={"fa-solid fa-heart"}/>
            <StatCard num={`${songCount}`} stat={"Songs"} icon={"fa-solid fa-music"}/>
        </div>
    </div>
  )
}

export default LibraryStats