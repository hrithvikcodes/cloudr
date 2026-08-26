import React, { useState, useEffect } from 'react'
import { API_URL } from '../../../api';

function StorageCard({ token, refreshKey}) {
  

  const [storage, setStorage] = useState({used_bytes: 0, limit_bytes: 0});


  useEffect(()=> {
    const fetchStorage = async () => {
    try {  
      const res = await fetch(`${API_URL}/songs/storage/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await res.json();
      setStorage(data);
    } catch (error) {
      console.error("Error fetching storage", error);
     }
    };


    if (token) fetchStorage();

    
  }, [token, refreshKey]);

  const { used_bytes, limit_bytes } = storage;

  const usedGB = used_bytes / (1024 * 1024 * 1024);
  const limitGB = limit_bytes / (1024 * 1024 * 1024);
  const remainingGB = Math.max(limitGB - usedGB, 0);
  const percentage = limit_bytes > 0 ? Math.min(Math.round((used_bytes / limit_bytes) * 100), 100) : 0;
  return (
    <div className="flex flex-col justify-between mt-4 p-4 sm:p-6 w-full min-w-0 bg-zinc-900 border border-zinc-800/80 rounded-3xl text-white shadow-lg">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-orange-500 shrink-0">
            <i className="fa-solid fa-hard-drive text-2xl"></i>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold leading-tight text-zinc-100 truncate">Storage Usage</h3>
            <p className="text-xs sm:text-sm text-zinc-400 truncate">Total Storage: {limitGB.toFixed(2)} GB</p>
          </div>
        </div>

        {/* Percentage Badge */}
        <span className="text-xs sm:text-sm font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shrink-0">
          {percentage}% Used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="my-5">
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Breakdown */}
      <div className="flex justify-between items-center text-sm text-zinc-400 gap-2">
        <span className="min-w-0 truncate">
          <strong className="text-xl sm:text-2xl font-bold text-zinc-100 mr-1">{usedGB.toFixed(2)} GB</strong> 
          used
        </span>
        <span className="min-w-0 truncate">
          <strong className="text-xl sm:text-2xl font-bold text-zinc-100 mr-1">{(remainingGB).toFixed(2)} GB</strong> 
          remaining
        </span>
      </div>

    </div>
  );
}

export default StorageCard;
