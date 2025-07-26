import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { assets } from '../../assets/assets'
import UserSidebar from '../../components/user/UserSidebar'


const UserLayout = () => {
    const {navigate,logout}=useAppContext()
    const { token, userRole } = useAppContext();

  if (!token || userRole !== "user") {
    return <Navigate to="/" replace />;
  }
  return (
    <>
        <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
            <img src={assets.logo} alt="" className='w-32 sm:w-40 cursor-pointer' onClick={()=>navigate('/')}/>
            <button className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer' onClick={logout} >Logout</button>
        </div>
        <div className='flex h-[calc(100vh-70px)]'>
            <UserSidebar />
            <Outlet/>
        </div>
    </>
  )
}

export default UserLayout