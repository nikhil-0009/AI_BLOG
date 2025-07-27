import React, { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import BlogCard from '../../components/BlogCard';


const UserDashboard = () => {
  const { blogs, fetchMyBlogs, token, userRole } = useAppContext();

  useEffect(() => {
    // Re-fetch blogs only if user is logged in and is a 'user'
    if (token && userRole === "user") {
      fetchMyBlogs();
    }
  }, [token, userRole]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 ">
  {blogs.map((blog) => (
    <BlogCard key={blog._id} blog={blog} />
  ))}
</div>
      )}
    </div>
  );
};

export default UserDashboard;
