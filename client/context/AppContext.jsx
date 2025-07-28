import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  //  Reusable login function
  const saveAuth = (newToken, role) => {
    setToken(newToken);
    setUserRole(role);
    localStorage.setItem(role === "admin" ? "token" : "userToken", newToken);
    localStorage.setItem("userRole", role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUserRole(null);
    
    navigate('/', { replace: true });
    toast.success("Logged out successfully");
  };

  // Fetch Blogs Function
  const fetchMyBlogs = async () => {
  try {
    const { data } = await axios.get('/api/user/myblogs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data.success ? setBlogs(data.blogs) : toast.error(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};
  const fetchBlogs = async () => {
  try {
    const { data } = await axios.get('/api/blog/all');
    data.success ? setBlogs(data.blogs) : toast.error(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  //  On App Load — Restore login
  useEffect(() => {
  const token = localStorage.getItem('token');
  const userToken = localStorage.getItem('userToken');
  const savedRole = localStorage.getItem('userRole');
  const activeToken = token || userToken;

  if (activeToken && savedRole) {
    setToken(activeToken);
    setUserRole(savedRole);
    axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
  }

  fetchBlogs(); // this will always work
}, []);

// Second: Once token is available, fetch user
useEffect(() => {
  if (!token) return;

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/user/me');
      setCurrentUser(res.data);
    } catch (err) {
      console.error('Error fetching currentUser:', err.response?.data || err.message);
    }
  };

  fetchCurrentUser();
}, [token]);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    logout,
    userRole,
    setUserRole,
    saveAuth,
    fetchBlogs,
    fetchMyBlogs,
    currentUser,         
  setCurrentUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
