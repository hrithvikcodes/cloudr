import React from 'react';

function SongCard({ name, artist, duration, size,onClick, isLiked, onLikeClick }) {
  return (
    <div className='relative flex flex-col justify-between w-full p-4 sm:p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl shadow-lg transition-all group cursor-pointer'>
      
      {/* Top Section: Like Button or Cross Button */}
      <div className='absolute top-4 right-4 z-10'>
        <button onClick={(e)=>{
          e.stopPropagation();
          if(onClick) onClick();
        }} className='p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors group/cross'>
          <i className="fa-solid fa-xmark text-zinc-400 group-hover/cross:text-white text-lg transition-colors"></i>
        </button>
        <button onClick={(e)=>{
          e.stopPropagation();
          if(onClick) onLikeClick();
        }}
          className='p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors group/heart'>
            {/*<i className={`fa-solid fa-heart transition-colors ${isLiked ? 'text-red-500': 'text-zinc-400'} group-hover/heart:text-red-500 text-lg transition-colors`}></i>*/}
            <i className={`fa-solid fa-heart transition-colors text-lg ${isLiked ? 'text-red-500' : 'text-zinc-500'}`}></i>
        </button>
      </div>

      {/* Middle Section: Play Icon + Song & Artist Info */}
      <div className='flex flex-row items-center gap-3 sm:gap-4 min-w-0 mt-4 sm:mt-6 mb-4 sm:mb-6 pr-8'>
        <button className='flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-zinc-800/80 rounded-2xl group-hover:bg-[#ff7a00]/10 transition-colors shrink-0'>
          <i className='fa-solid fa-play text-[#ff7a00] text-lg sm:text-xl group-hover:scale-110 transition-transform pl-0.5'></i>
        </button>
        
        <div className='flex flex-col min-w-0'>
          <span className='text-white text-base sm:text-lg font-medium truncate'>
            {name}
          </span>
          <span className='text-zinc-400 text-xs sm:text-sm font-medium truncate'>
            {artist}
          </span>
        </div>
      </div>

      {/* Bottom Section: Duration & Size */}
      <div className='flex flex-row items-center gap-3 text-zinc-500 text-xs sm:text-sm font-medium shrink-0'>
        <span>{duration}</span>
        <span>•</span>
        <span>{size}</span>
      </div>
    </div>
  );
}

export default SongCard;