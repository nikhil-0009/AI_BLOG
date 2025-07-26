import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Login from "./components/admin/Login";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from "../context/AppContext";
import UserLogin from "./components/user/UserLogin";
import UserSignup from "./components/user/UserSignup";
import UserDashboard from "./pages/user/userDashboard";
import UserLayout from "./pages/user/UserLayout";
import UserAddBlog from "./pages/user/UserAddBlog";
import UserProfile from "./pages/user/UserProfile";

const App = () => {
  const { token ,userRole } = useAppContext();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />

        <Route path="/admin" element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addblog" element={<AddBlog />} />
          <Route path="listblog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />

<Route
  path="/user"
  element={token && userRole === "user" ? <UserLayout /> : <Navigate to="/user/login" />}
>
  <Route path="dashboard" element={<UserDashboard />} />
  <Route path="addblog" element={<UserAddBlog />} />
  <Route path="profile" element={<UserProfile />} />
  
</Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default App;
