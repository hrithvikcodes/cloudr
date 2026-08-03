import React from 'react'
import { NavLink } from 'react-router-dom'

function NavItem({ icon, name, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-row items-center gap-3 lg:gap-4 m-2 lg:m-4 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all shrink-0 min-w-0 ${isActive ? 'bg-zinc-800' : ''}`
      }
    >
      <i className={`${icon} text-zinc-400 text-2xl lg:text-2xl shrink-0`}></i>
      <h2 className='text-white font-medium text-xl lg:text-xl hidden sm:block lg:block truncate min-w-0'>{name}</h2>
    </NavLink>
  )
}

export default NavItem
