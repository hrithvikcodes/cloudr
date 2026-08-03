import React, { useState } from "react";

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] flex items-center justify-between gap-2 sm:gap-4 w-full h-16 sm:h-20 px-2 sm:px-4 bg-zinc-950 border-t border-zinc-800 text-white box-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Track Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="hidden xs:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
          <i className="fa-solid fa-cloud-bolt text-orange-500 text-sm sm:text-base"></i>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs sm:text-sm truncate">Midnight City</span>
          <span className="text-[10px] sm:text-xs text-zinc-400 truncate">M83</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1 flex-1 max-w-[160px] sm:max-w-xs shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:inline-flex bg-transparent border-none text-zinc-300 cursor-pointer text-sm p-0">
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 border-none cursor-pointer text-black shrink-0"
          >
            {isPlaying ? (
              <i className="fa-solid fa-pause text-xs"></i>
            ) : (
              <i className="fa-solid fa-play text-xs ml-0.5"></i>
            )}
          </button>
          <button className="hidden sm:inline-flex bg-transparent border-none text-zinc-300 cursor-pointer text-sm p-0">
            <i className="fa-solid fa-forward-step"></i>
          </button>
        </div>
        <div className="hidden sm:flex w-full items-center gap-2 text-[9px] text-zinc-400">
          <span className="shrink-0">1:24</span>
          <div className="flex-1 h-[3px] bg-zinc-800 rounded-full relative min-w-0">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-orange-500 rounded-full"></div>
          </div>
          <span className="shrink-0">4:03</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden sm:flex items-center justify-end gap-2 flex-1">
        <i className="fa-solid fa-volume-high text-zinc-400 text-base"></i>
      </div>
    </div>
  );
}
