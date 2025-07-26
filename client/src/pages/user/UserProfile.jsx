import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendarAlt,
  FaIdBadge,
  FaPenFancy,
  FaComments,
} from 'react-icons/fa';

const UserProfile = () => {
  const { token, axios } = useAppContext();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ blogsCount: 0, commentsCount: 0 });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [axios, token]);

  // Fetch user stats after user is available
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/api/user/stats/${user._id}`);
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [user, axios]);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  if (!user) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-12">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 bg-indigo-600 text-white text-3xl font-bold flex items-center justify-center rounded-full shadow-lg">
            {getInitials(user.name)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
              <FaEnvelope className="text-indigo-500" />
              {user.email}
            </p>
            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
              <FaUserTag className="text-indigo-500" />
              Role: {user.role}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 space-y-3 text-gray-600 text-sm sm:text-base">
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2 break-all">
            <FaIdBadge className="text-blue-500" />
            <strong>User ID:</strong> {user._id}
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-indigo-600">
            <FaPenFancy />
            <span><strong>Blogs:</strong> {stats.blogsCount}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <FaComments />
            <span><strong>Comments:</strong> {stats.commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
