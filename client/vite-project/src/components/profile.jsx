import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim().replace(/[\r\n]+/g, '');
console.log('Token length:', token.length);

    console.log(`Authorization header: Bearer ${token}`);
console.log(JSON.stringify(`Bearer ${token}`));
   axios.get("http://localhost:5000/api/users/get", {
  headers: {
    Authorization: `Bearer ${token.trim().replace(/[\r\n]+/g, '')}`,
  }
})
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(data);
      })
      .catch(err => {
        console.error("❌ Error fetching profile:", err);
      });
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-xl text-amber-800 font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 pt-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-400">My Profile</h1>
        <p className="text-gray-600 mt-2">View your details and manage your account</p>
      </div>
        <Link to="/" className="absolute top-4 left-4">
          <button className="bg-indigo-400 hover:bg-indigo-500 text-white px-4 py-2 rounded-md shadow">
            ← Back
          </button>
        </Link>

      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 relative">

        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          <UserCircle className="w-24 h-24 text-indigo-300" />
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-indigo-500 mb-2">{profile?.name || "N/A"}</h2>
          <p className="text-gray-700 text-lg">{profile?.email || "N/A"}</p>
          <p className="text-gray-500 mt-2">Role: <span className="font-semibold text-blue-500 text-3xlbold">{profile?.role || "N/A"}</span></p>
        </div>

        {/* Stats / Actions */}
        <div className="mt-10 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-indigo-100 p-6 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-blue-700">10</span>
            <p className="text-gray-700 mt-1">Bookings</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-blue-700">2</span>
            <p className="text-gray-700 mt-1">Reviews</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg shadow-sm">
            <span className="text-2xl font-bold text-blue-900">100%</span>
            <p className="text-gray-700 mt-1">Satisfaction</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
