import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'

const UserLogin = () => {
  const { navigate, saveAuth, token, userRole } = useAppContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoggingIn(true)
      const { data } = await axios.post('/api/user/login', { email, password })

      if (data.success) {
        toast.success(data.message)
        saveAuth(data.token, "user") 
      } else {
        toast.error(data.message)
        setLoggingIn(false)
      }
    } catch (error) {
      toast.error(error.message)
      setLoggingIn(false)
    }
  }

  //  Once login is complete and context updates, redirect
  useEffect(() => {
    if (token && userRole === "user") {
      navigate("/user/dashboard")
    }
  }, [token, userRole])

  return (
    <>
      <div className='flex items-center justify-center h-screen'>
        <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-full py-6 text-center'>
              <h1 className='text-3xl font-bold'><span className='text-primary'>User</span> Login</h1>
              <p className='font-light'>Enter your Credentials to Access the User Panel</p>
            </div>
            <form className='mt-6 w-full sm:max-w-md text-gray-600' onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <label>Email</label>
                <input
                  type="email"
                  required
                  placeholder='Your Email id'
                  className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='flex flex-col'>
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder='Your Password'
                  className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type='submit'
                className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90'
                disabled={loggingIn}
              >
                {loggingIn ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div>New here? <Link to="/user/signup"><i className='text-primary'>Signup</i></Link></div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default UserLogin
