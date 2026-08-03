import React from 'react';
import { useState, useEffect } from 'react';
import SongCard from '../components/myspace/SongCard'; 

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

function MySpace({userId}) {
  
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());


  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`http://localhost:8000/liked/user/${userId}`, {
          method: 'GET',
        });
        const data = await res.json();
        
        setLikedIds(new Set(data.map(song => song.song_id)));
      } catch (error) {
        console.error("Error fetching likes", error);
      }
    };

    if (userId) fetchLikes();
  }, [userId]);

  
  const toggleLike = async (songId) => {
    const isLiked = likedIds.has(songId);

    try {
      if (isLiked) {
        await fetch(`http://localhost:8000/liked/${songId}?user_id=${userId}`, {
          method: 'DELETE',
        });
        setLikedIds(prev => {
          const next = new Set(prev);
          next.delete(songId);
          return next;
        });
      } else {
        
        await fetch(`http://localhost:8000/liked/${songId}?user_id=${userId}`, {
          method: 'POST', 
        });
        setLikedIds(prev => new Set(prev).add(songId));
      }
    } catch (error) {
      console.error("Error toggling like state: ", error);
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`http://localhost:8000/songs/user/${userId}`, {
          method: 'GET',
        });
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    if (userId) fetchSongs();
  }, [userId]);

  const handleDelete = async (songId) => {
    if (!songId) return console.error("No songId provided"); 
    try {
      const res = await fetch(`http://localhost:8000/songs/${songId}`, {
        method: 'DELETE',
      });
      if (res.ok){
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      } else {
        console.error(`Failed to delete song. Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Network error or server unreachable: ", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredSongs = songs.filter((song) => {
    const query = search.toLowerCase().trim();
    return (
      song.title?.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className='flex flex-col gap-6 sm:gap-8 p-2 max-w-7xl mx-auto w-full pb-36'>
      
      {/* Search Bar */}
      <div className='relative w-full max-w-xl'>
        <i className='fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg'></i>
        <form onSubmit={handleSearch} className='search-form'>
        <input
          value={search}
          onChange={(e)=> setSearch(e.target.value)}
          type='text'
          placeholder='Search songs or artists...'
          className='w-full pl-13 pr-5 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-[#ff7a00] text-white rounded-2xl outline-none placeholder:text-zinc-500 transition-colors text-base'
        />
        </form>
      </div>

      {/* Page Title */}
      <h2 className='text-white text-3xl sm:text-5xl font-medium tracking-tight'>My Space</h2>

      {/* Section Header */}
      <div className='flex flex-row items-center justify-between border-b border-zinc-800/60 pb-3'>
        <h3 className='text-zinc-200 text-xl sm:text-2xl font-semibold'>All Songs</h3>
        <span className='text-zinc-500 text-sm font-medium'>
          {songs.length} songs
        </span>
      </div>

      {/* Songs Grid List */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto no-scrollbar'>
        {filteredSongs.map((song) => (
          <SongCard
            key={song.id}
            name={song.title}
            artist={song.artist}
            duration={formatDuration(song.duration_seconds)}
            size={formatFileSize(song.file_size_bytes)}
            onClick={() => handleDelete(song.id)}
            isLiked={likedIds.has(song.id)}
            onLikeClick={() => toggleLike(song.id)}
          />
        ))}

         {filteredSongs.length === 0 && songs.length > 0 && (<p className='flex gap-3 text-zinc-500 text-3xl mt-2'><i className='fa-solid fa-headset text-zinc-400 text-5xl'></i>No Songs found matching your search</p>)}
         {songs.length === 0 && (<p className='flex flex-row gap-3 text-zinc-500 text-3xl mt-2'><i className='fa-solid fa-headset text-zinc-400 text-5xl'></i>Stored songs will appear here </p>)}
      </div>

    </div>
  );
}

export default MySpace;
