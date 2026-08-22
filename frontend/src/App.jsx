import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient.js'
import LeftNav from './components/nav/LeftNav.jsx'
import Header from './components/header/Header.jsx'
import LibraryStats from './components/library_stats/LibraryStats.jsx'
import Recent from './components/recent/Recent.jsx'
import MySpace from './pages/MySpace.jsx'
import Upload from './pages/Upload.jsx'
import Playlists from './pages/Playlists.jsx'
import Liked from './pages/Liked.jsx'
import PlayerBar from './components/player/PlayerBar.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'


function App() {

  const location = useLocation();
  const isAuthPage = location.pathname == "/login" || location.pathname == "/signup";
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);

  const [queue, setQueue] = useState([]);

  
  useEffect(() => {
    //  initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])


 
      

  const userId = session?.user?.id
  const accessToken = session?.access_token

  if (loading) {
    return <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>
  }

  

  const handleLogout = async (e) => {
    await supabase.auth.signOut();
    setSession(null);    
  }

  const playSong = (song, songList) => {
      setQueue(songList);
      setCurrentSong(song);
  }

  const playNext = async () => {
    if (!queue || queue.length === 0) return;
    const currentIdx = queue.findIndex((s)=> s.id == currentSong?.id);
    
    if (currentIdx == -1 || currentIdx == queue.length -1 ) return;
    playSong(queue[currentIdx+1],queue);
  }

  const playPrevious = async () => {
    if (!queue || queue.length === 0) return;
    const currentIdx = queue.findIndex((s) => s.id == currentSong?.id);

    if(currentIdx <= 0) return;
    playSong(queue[currentIdx - 1], queue);
  }

  const onPlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("REached the end..")

  }
  return (
    <div className='flex flex-col lg:flex-row w-full min-h-dvh bg-zinc-950 text-white'>
      
      {/* Left Navigation */}
      {!isAuthPage && <LeftNav onLogout={handleLogout}/>}

      {/* Main Content Area  */}
      <div className='flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pb-32 lg:pb-36 min-w-0'>
        <Routes>
          <Route path="/" element={ userId ? (
            <div className='flex flex-col gap-8'>
              <Header />
              <LibraryStats />
              <Recent userId={userId} onPlaySong={playSong} token={accessToken}/>
            </div>) : <Navigate to="/login" replace/>
          } />
          
          <Route path="/myspace" element={userId ? <MySpace userId={userId} token={accessToken} onPlaySong ={playSong} /> : <Navigate to="/login" replace />} />
          <Route path="/upload" element={userId ? <Upload userId={userId}  token={accessToken} /> : <Navigate to="/login" replace/>}/>
          <Route path="/playlists" element={userId ? <Playlists /> : <Navigate to="/login" replace/>} />
          <Route path="/liked" element={userId ? <Liked userId={userId}  token={accessToken} onPlaySong={playSong}/> : <Navigate to="/login" replace />} />
          <Route path='/signup' element={!userId ? <Signup /> : <Navigate to="/" replace/>}/>
          <Route path='/login' element={!userId ? <Login/> : <Navigate to="/" replace/>}/>
          
        </Routes>
      </div>

      {/* fixed player */}
      {!isAuthPage && <PlayerBar song={currentSong} userId={userId} token={accessToken} queue={queue} onSongEnd={playNext} playForwardSong={playNext} playBackwardSong={playPrevious}/>}

    </div>
  )
}

export default App
