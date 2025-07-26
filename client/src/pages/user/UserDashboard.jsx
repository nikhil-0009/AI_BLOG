import React, { useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';


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
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-700">{blog.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
