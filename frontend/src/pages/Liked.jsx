import React from 'react'
import SongCard from '../components/myspace/SongCard'; 
import { useState, useEffect } from 'react';
import { API_URL } from '../api';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function Liked({userId, onPlaySong, token}) {
  const [searchLiked, setSearchLiked] = useState("");
  const [likedSongs, setLikedSongs] = useState([]);
  
  
  const toogleUnlike = async (songId) => {
    try {
      const res = await fetch(`${API_URL}/liked/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setLikedSongs(prev => prev.filter(song => song.song_id != songId))
    } catch (error) {
      console.error("Couldnt unlike song ", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
  }

  const filteredLikedSongs = likedSongs.filter((song) => {
    const query = searchLiked.toLowerCase().trim();
    return (
      song.title?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query)
    )
  })

  useEffect(() => {

    const fetchLikedSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/liked/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLikedSongs(data);
      } catch (error) {
        console.error(`Error fetching songs: `, error);
      }
    };
    fetchLikedSongs();
  }, [userId, token]);

  const handleDelete = async (songId) => {
    if (!songId) return console.error("No songId provided");
    try {
      const res = await fetch(`${API_URL}/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setLikedSongs((prevSongs) => prevSongs.filter((song) => song.song_id !== songId));
      } else {
        console.error(`Failed to delete song. Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Network error or Server Unreachable: ", error);
    }
  };
  

  return (
    <div className='flex flex-col gap-6 sm:gap-8 p-2 max-w-7xl mx-auto w-full pb-36'>

      <div className='relative w-full max-w-xl'>
        <i className='fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg'></i>
        <form onSubmit={handleSearch} className='search-form'>
        <input
          value={searchLiked}
          onChange={(e) => setSearchLiked(e.target.value)}
          type='text'
          placeholder='Search liked songs...'
          className='w-full pl-13 pr-5 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-[#ff7a00] text-white rounded-2xl outline-none placeholder:text-zinc-500 transition-colors text-base'
        />
        </form>
      </div>
      

      <h2 className='text-white text-3xl sm:text-5xl font-medium tracking-tight'>Liked</h2>

      <div className='flex flex-row items-center justify-between border-b border-zinc-800/60 pb-3'>
        <h3 className='text-zinc-200 text-xl sm:text-2xl font-semibold'>Liked Songs</h3>
        <span className='text-zinc-500 text-sm font-medium'>
          {filteredLikedSongs.length} songs
        </span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto no-scrollbar'>
        {filteredLikedSongs.map((song) => (
          <SongCard
            key={song.id}
            name={song.title}
            artist={song.artist}
            duration={formatDuration(song.duration_seconds)}
            size={formatFileSize(song.file_size_bytes)}
            onClick={() => handleDelete(song.song_id)}
            isLiked={true}
            onLikeClick={() => toogleUnlike(song.song_id)}
            onPlayClick={() => onPlaySong({ ...song, id: song.song_id }, filteredLikedSongs.map(s => ({ ...s, id: s.song_id })))}
          />
        ))}
      </div>
       {filteredLikedSongs.length === 0 && (<p className='flex flex-row gap-3 text-zinc-500 text-3xl mt-2'><i className='fa-solid fa-headset text-zinc-400 text-5xl'></i>Liked songs will appear here </p>)}
    </div>

    
  );
}

export default Liked;