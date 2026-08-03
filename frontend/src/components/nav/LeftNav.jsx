import React from 'react'
import NavItem from './NavItem.jsx'

function LeftNav() {
  return (
    <div className='flex flex-col h-auto lg:h-dvh w-full lg:w-64 xl:w-72 shrink-0'>
        <div className='flex flex-col h-auto lg:h-[calc(100dvh-3rem)] w-full bg-zinc-900 m-0 lg:m-6 rounded-none lg:rounded-3xl p-4 lg:p-0'>
            <div className='flex flex-row items-center text-3xl lg:text-4xl text-white gap-4 p-4'>
              <i className="fa-brands fa-soundcloud text-[#ff7a00]"></i>
              <h3>Cloudr</h3>
            </div>

            <div className='flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible mt-2 lg:mt-6 gap-2 lg:gap-0 no-scrollbar'>
                <NavItem name={"Home"} icon={"fa-solid fa-house"} to={"/"}/>
                <NavItem name={"My Space"} icon={"fa-solid fa-earth-americas"} to={"/myspace"}/>
                <NavItem name={"Upload"} icon={"fa-solid fa-upload"} to={"/upload"}/>
                <NavItem name={"Playlists"} icon={"fa-solid fa-music"} to={"playlists"}/>
                <NavItem name={"Liked"} icon={"fa-solid fa-house"} to={"liked"}/>
            </div>
        </div>
    </div>
  )
}

export default LeftNav
