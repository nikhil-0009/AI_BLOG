import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const UserSidebar = () => {
  return (
    <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>
        <NavLink end={true} to={'/user/dashboard'} className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive&& "bg-primary/10 border-r-4 border-primary"}`}>
            <img src={assets.home_icon} alt="" className='min-w-4 w-5' />
            <p className='hidden md:inline-block'>My Blogs</p>
        </NavLink>
        <NavLink to={'/user/addblog'} className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive&& "bg-primary/10 border-r-4 border-primary"}`}>
            <img src={assets.add_icon} alt="" className='min-w-4 w-5' />
            <p className='hidden md:inline-block'>Add Blog</p>
        </NavLink>
        <NavLink to={'/user/profile'} className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive&& "bg-primary/10 border-r-4 border-primary"}`}>
            <img src={assets.user_icon} alt="" className='min-w-4 w-5' />
            <p className='hidden md:inline-block'>My Profile</p>
        </NavLink>
    </div>
  )
}

export default UserSidebar