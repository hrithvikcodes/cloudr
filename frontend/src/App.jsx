import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LeftNav from './components/nav/LeftNav.jsx'
import Header from './components/header/Header.jsx'
import LibraryStats from './components/library_stats/LibraryStats.jsx'
import Recent from './components/recent/Recent.jsx'
import MySpace from './pages/MySpace.jsx'
import Upload from './pages/Upload.jsx'
import Playlists from './pages/Playlists.jsx'
import Liked from './pages/Liked.jsx'
import PlayerBar from './components/player/PlayerBar.jsx'
const TEST_USER_ID = "308cfac0-6235-4880-919a-be76686247e7";

function App() {
  return (
    <div className='flex flex-col lg:flex-row w-full min-h-dvh bg-zinc-950 text-white'>
      
      {/* Left Navigation */}
      <LeftNav />

      {/* Main Content Area with safe bottom spacing for the fixed player bar */}
      <div className='flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pb-32 lg:pb-36 min-w-0'>
        <Routes>
          <Route path="/" element={
            <div className='flex flex-col gap-8'>
              <Header />
              <LibraryStats />
              <Recent />
            </div>
          } />
          
          <Route path="/myspace" element={<MySpace userId={TEST_USER_ID} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/liked" element={<Liked userId={TEST_USER_ID} />} />
        </Routes>
      </div>

      {/* Guaranteed fixed player bar */}
      <PlayerBar />

    </div>
  )
}

export default App
