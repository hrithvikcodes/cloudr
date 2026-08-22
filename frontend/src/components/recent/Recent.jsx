import React, { useEffect, useState } from 'react'
import RecentCard from './RecentCard.jsx'

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function Recent({userId, onPlaySong, token}) {
    const [recent, setRecent] = useState([]);


    useEffect(() => {
        const fetchRecents = async () => {
            try {
                const res = await fetch(`http://localhost:8000/recent/songs`,{
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();

                setRecent(data);

            } catch (error) {
                console.error("Error fetching recent", error);
            }
        };
        if (userId) fetchRecents();
    },[userId, token])
  return (
    <div className='flex flex-col p-4 sm:p-6'>
        <h3 className='text-2xl sm:text-3xl font-medium text-white mb-6'>Recent</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full'>
            
        {recent.map((song) => (
          <div key={song.id} className='h-auto sm:h-[12vh] w-full'>
            <RecentCard
              name={song.title}
              duration={formatDuration(song.duration_seconds)}
              size={formatFileSize(song.file_size_bytes)}
              onPlayClick={() => {
                onPlaySong(
                  {...song, id: song.song_id },
                  recent.map(s => ({ ...s, id: s.song_id }))
                );}
              }
            />
          </div>
        ))}
      </div>
        </div>
    
  )
}

export default Recent