import React, { useState } from 'react';
import StorageCard from '../components/header/storage/StorageCard';
import QueueCard from '../components/queue/QueueCard';
import SmartClassifyToggle from '../components/smart_classify/SmartClassifyToggle';
import { API_URL } from '../api';


function Upload({token}) {
  const [smartClassify, setSmartClassify] = useState(false);
  const [upload, setUpload] = useState([]);
  
  const allowedExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.alac', '.aac', '.ogg'];

  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(Math.round(audio.duration));
    };
      audio.onerror = () => reject(new Error('Could not read audio metadata'));
      audio.src = URL.createObjectURL(file);
    });
  };

  const getUUID = async () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  } 

  const uploadSong = async (file) => {
    //const tempId = crypto.randomUUID();
    const tempId = getUUID();
    const cleanTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

    setUpload((prev) => [...prev, { id: tempId, title: cleanTitle, status: 'uploading' }]);

    const updateStatus = (status) => {
      setUpload((prev) => prev.map((u) => u.id === tempId ? { ...u, status } : u));
    };

    try {
      const presignRes = await fetch(`${API_URL}/songs/presign-upload`,{
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
          file_size_bytes: file.size,
        })
      });

      if(!presignRes.ok){
        const errBody = await presignRes.json().catch(()=> null);
        console.error("Presign failed: ", presignRes.status, errBody);
        alert(errBody?.detail || 'Upload failed. Please try again');
        updateStatus('error');
        return;
      }

      const { upload_url, key} = await presignRes.json();

      const putRes = await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-type': file.type,
          
        },
        body: file,
        
      });

      if(!putRes.ok) {
        console.error("R2 upload failed", putRes.statusText);
        updateStatus('error');
        return;
      }

      const durationSeconds = await getAudioDuration(file);

      const confirmRes = await fetch(`${API_URL}/songs/confirm-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({
          key: key,
          title: cleanTitle,
          artist: '',
          duration_seconds: durationSeconds,
          content_type: file.type,
        })
      })

      if (confirmRes.ok) {
        updateStatus('done');
      } else {
         console.error("Confirm failed:", confirmRes.statusText);
         updateStatus('error');
      }

    } catch (error) {
      console.error("Network communication failure:", error);
      updateStatus('error');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUploadDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        const file_name = file.name.toLowerCase();
        const isAudio = allowedExtensions.some(ext => file_name.endsWith(ext));

        if (isAudio) {
          
          uploadSong(file)
          
        } else {
          console.warn(`Rejected invalid file format: ${file.name}`);
        }
      }
    }
  };

  const handleUploadButton = (e) => {
    const el = e.target;
    if (el && el.files && el.files[0]) {
      for (let i = 0; i < el.files.length; i++) {
        const file = el.files[i];
      const file_name = file.name.toLowerCase();
      
      const isAudio = allowedExtensions.some(ext => file_name.endsWith(ext));

      if (isAudio) {
        
        uploadSong(file); 
      } else {
        console.warn(`Rejected invalid file format: ${file.name}`);
      }
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 pb-36'>
      {/* Header & Smart Classify Toggle */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h2 className='text-white text-3xl sm:text-5xl font-medium'>Upload</h2>
        <SmartClassifyToggle enabled={smartClassify} setEnabled={setSmartClassify} />
      </div>

      {/* Upload Drop Zone */}
      <div 
        className='flex flex-col min-h-[16rem] sm:min-h-[20rem] py-12 w-full bg-zinc-900 rounded-3xl justify-center items-center' 
        onDragOver={handleDragOver} 
        onDrop={handleUploadDrop}
      >
        <div className='flex flex-col gap-4 sm:gap-6 p-4 items-center justify-center text-center'>
          <i className="fa-solid fa-cloud-arrow-up text-zinc-400 text-6xl sm:text-9xl mt-4"></i>
          <h2 className='text-white font-medium text-xl sm:text-3xl'>Drop your audio files here</h2>
          
          <p className='text-[#ff7a00] text-lg sm:text-2xl font-medium cursor-pointer'>
            <label className='text-[#ff7a00] text-lg sm:text-2xl font-medium cursor-pointer hover:underline'>
              <input 
                type="file" 
                className='hidden' 
                multiple 
                onClick={(e) => { e.target.value = '' }} 
                onChange={handleUploadButton} 
                accept='.mp3,.wav,.aiff,.flac,.alac,.aac,.ogg' 
              />
              or browse files to upload
            </label>
          </p>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10'>
        <div className='flex-1 min-w-0'>
          <StorageCard token={token}/>
        </div>
        <div className='flex-1 min-w-0'>
          <QueueCard upload = {upload}/>
        </div>
      </div>
    </div>
  );
}

export default Upload;