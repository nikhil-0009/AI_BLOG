import { assets } from '../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {
    const {navigate,token,userRole}=useAppContext()
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className="w-32 sm:w-44 cursor-pointer" />

      <div className="flex flex-col md:flex-row gap-3">
  {token && userRole?.toLowerCase() === 'admin' ? (
    <button
      onClick={() => navigate('/admin/dashboard')}
      className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white md:px-8 py-2.5 px-3"
    >
      Admin Dashboard
      <img src={assets.arrow} className="w-3" alt="arrow" />
    </button>
  ) : token && userRole?.toLowerCase() === 'user' ? (
    <button
      onClick={() => navigate('/user/dashboard')}
      className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white md:px-8 py-2.5 px-3"
    >
      User Dashboard
      <img src={assets.arrow} className="w-3" alt="arrow" />
    </button>
  ) : (
    <>
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white md:px-8 py-2.5 px-3"
      >
        Admin Login
        <img src={assets.arrow} className="w-3" alt="arrow" />
      </button>
      <button
        onClick={() => navigate('/user')}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white md:px-8 py-2.5 px-3"
      >
        User Login
        <img src={assets.arrow} className="w-3" alt="arrow" />
      </button>
    </>
  )}
</div>

    </div>
  )
}

export default Navbar