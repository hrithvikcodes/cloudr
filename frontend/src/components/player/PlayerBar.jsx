import React, { useState, useRef, useEffect } from "react";
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const totalSeconds = Math.floor(seconds);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
export default function PlayerBar({song, userId, queue, onSongEnd, onPlayNext, playForwardSong, playBackwardSong}) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

 

  useEffect(()=> {
    if(song && audioRef.current){
      audioRef.current.play();
    }
  }, [song?.id])

  const postRecentSong = async (songId) => {
    try {
      const res = await fetch(`http://localhost:8000/recent/${songId}?user_id=${userId}`, {
        method: 'POST'
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching recent song", error)
    }
  }

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] flex items-center justify-between gap-2 sm:gap-4 w-full h-16 sm:h-20 px-2 sm:px-4 bg-zinc-950 border-t border-zinc-800 text-white box-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <audio
        ref={audioRef}
        src={song ? `http://localhost:8000/songs/${song.id}/stream` : undefined}
        onPlay={() => { console.log("PLAY FIRED!"); setIsPlaying(true); postRecentSong(song.id) }}
        onPause={() => { console.log("PAUSE FIRED"); setIsPlaying(false) }}
        onLoadedMetadata={()=> {setDuration(audioRef.current.duration)}}
        onTimeUpdate={()=> {setCurrentTime(audioRef.current.currentTime)}}
        onEnded={()=> {console.log("End!"); onSongEnd();}}
      ></audio>
      {/* Track Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="hidden xs:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
          <i className="fa-solid fa-cloud-bolt text-orange-500 text-sm sm:text-base"></i>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs sm:text-sm truncate">{song ? song.title : "No song Playing"}</span>
          <span className="text-[10px] sm:text-xs text-zinc-400 truncate">{song ? song.artist : "artist"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1 flex-1 max-w-[160px] sm:max-w-xs shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:inline-flex bg-transparent border-none text-zinc-300 cursor-pointer text-sm p-0" 
          onClick={playBackwardSong}>
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 border-none cursor-pointer text-black shrink-0"
          >
            {isPlaying ? (
              <i className="fa-solid fa-pause text-xs"></i>
            ) : (
              <i className="fa-solid fa-play text-xs ml-0.5"></i>
            )}
          </button>
          <button className="hidden sm:inline-flex bg-transparent border-none text-zinc-300 cursor-pointer text-sm p-0"
          onClick={playForwardSong}>
            <i className="fa-solid fa-forward-step"></i>

            
          </button>
        </div>
        <div className="hidden sm:flex w-full items-center gap-2 text-[9px] text-zinc-400">
          <span className="shrink-0">{formatDuration(currentTime)}</span>
          <div className="flex-1 h-[3px] bg-zinc-800 rounded-full relative min-w-0">
            <div className="absolute top-0 left-0 h-full  bg-orange-500 rounded-full" style={{width: `${duration ? (currentTime/duration) * 100 : 0}% `}}></div>
          </div>
          <span className="shrink-0">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden sm:flex items-center justify-end gap-2 flex-1">
        <i className="fa-solid fa-volume-high text-zinc-400 text-base"></i>
      </div>
    </div>
  );
}
