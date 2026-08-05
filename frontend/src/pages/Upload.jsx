import React, { useState } from 'react';
import StorageCard from '../components/header/storage/StorageCard';
import QueueCard from '../components/queue/QueueCard';
import SmartClassifyToggle from '../components/smart_classify/SmartClassifyToggle';
const userId = "308cfac0-6235-4880-919a-be76686247e7";

function Upload() {
  const [smartClassify, setSmartClassify] = useState(false);
  const [upload, setUpload] = useState([]);
  
  const allowedExtensions = ['.mp3', '.wav', '.aiff', '.flac', '.alac', '.aac', '.ogg'];

  const uploadSong = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const cleanTitle = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      formData.append('title', cleanTitle);
      formData.append('artist', '');

      const res = await fetch(`http://localhost:8000/songs?user_id=${userId}`, { 
       method: 'POST', 
         body: formData 
       });

      if (res.ok) {
        const data = await res.json();
        console.log("Upload success:", data);
        setUpload((prev) => [...prev, { name: file.name, title: cleanTitle, id: data.id || Date.now() }]);
      } else {
        console.error("Upload failed server error:", res.statusText);
      }
    } catch (error) {
      console.error("Network communication failure:", error);
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
          console.log("Accepted audio file:", file.name);
          uploadSong(file)
          // Proceed with upload logic for valid audio track here
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
      //  Reuses the extension validation check
      const isAudio = allowedExtensions.some(ext => file_name.endsWith(ext));

      if (isAudio) {
        console.log("Accepted audio file via browser:", file.name);
        uploadSong(file); //  Triggers the upload request
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
          <StorageCard />
        </div>
        <div className='flex-1 min-w-0'>
          <QueueCard upload = {upload}/>
        </div>
      </div>
    </div>
  );
}

export default Upload;
