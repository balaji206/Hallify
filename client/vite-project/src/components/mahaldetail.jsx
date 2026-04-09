import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MahalDetails = () => {
  const { id } = useParams();
  const [mahal, setMahal] = useState(null);
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    axios
      .get(`https://hallify.onrender.com/api/mahal/get/${id}`)
      .then((res) => setMahal(res.data))
      .catch((err) => console.error("❌ Error fetching mahal:", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this venue? This action cannot be undone.")) return;

      const token = localStorage.getItem("token");
      await axios.delete(`https://hallify.onrender.com/api/mahal/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Venue deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting mahal:", err);
      alert("Failed to delete venue");
    }
  };

  if (!mahal) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-800 rounded-full animate-spin"></div>
        <div className="text-xl font-serif text-rose-800">Curating Venue Details...</div>
      </div>
    </div>
  );

  const canEdit = user?.role === "admin";
  const canDelete =
    user?.role === "admin" || (user?.role === "owner" && user?.id === mahal.owner_id);

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans text-gray-800 pb-20">

      {/* Hero Header Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img
          src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
          alt={mahal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end pb-12 px-6 md:px-16 text-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Premium Venue
              </span>
              <span className="flex items-center text-amber-400 text-sm font-semibold">
                ★ 4.8 (124 Reviews)
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif tracking-wide drop-shadow-lg mb-4">
              {mahal.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-200 text-sm md:text-base tracking-wide font-medium">
              <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {mahal.location}
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
          <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-white hover:-translate-x-1 transition-all font-medium text-sm border border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Venues
          </button>
        </Link>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col lg:flex-row gap-12">

        {/* Left Column: Extensive Venue Details */}
        <div className="flex-1 space-y-12">

          {/* About Section */}
          <section>
            <h2 className="text-3xl font-serif text-rose-900 mb-6 flex items-center gap-4">
              About the Venue
              <div className="flex-1 h-px bg-rose-200 mt-2"></div>
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line bg-white p-6 rounded-2xl shadow-sm border border-rose-50/50">
              {mahal.description}
            </p>
          </section>

          {/* Amenities & Facilities */}
          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Facilities & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "❄️", label: "Centralized A/C" },
                { icon: "🚗", label: "Valet Parking" },
                { icon: "🛏️", label: "10 Guest Rooms" },
                { icon: "🔌", label: "Power Backup" },
                { icon: "🍽️", label: "In-house Catering" },
                { icon: "🎭", label: "Stage Decor" },
                { icon: "📹", label: "CCTV Security" },
                { icon: "🎵", label: "DJ & Sound System" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition">
                  <span className="text-3xl mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Details */}
          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Pricing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-rose-800 font-semibold mb-4 uppercase tracking-wider text-sm">Rental Cost</h3>
                <div className="text-3xl font-serif text-gray-900 mb-2">₹{mahal.price} <span className="text-base font-sans text-gray-500 font-normal">/ day</span></div>
                <p className="text-sm text-gray-500">Includes main hall, dining area, and standard lighting.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-rose-800 font-semibold mb-4 uppercase tracking-wider text-sm">Catering (Optional)</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Vegetarian</span>
                  <span className="text-gray-900 font-semibold">₹450 / plate</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-gray-700 font-medium">Non-Vegetarian</span>
                  <span className="text-gray-900 font-semibold">₹650 / plate</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-white rounded-2xl shadow-xl shadow-rose-900/5 border border-gray-100 p-8 sticky top-10">

            {/* Price Header */}
            <div className="text-center pb-6 border-b border-gray-100">
              <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-2">Venue Rental</p>
              <div className="text-4xl font-serif text-rose-700 font-bold">
                ₹{mahal.price}
              </div>
              <p className="text-sm text-gray-500 mt-1">Pricing may vary based on dates</p>
            </div>

            {/* Quick Stats */}
            <div className="py-6 space-y-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-3 rounded-full text-amber-600 border border-amber-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Max Capacity</p>
                  <p className="font-semibold text-lg text-gray-800">{mahal.capacity} Guests</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-3 rounded-full text-amber-600 border border-amber-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Contact Manager</p>
                  <p className="font-semibold text-lg text-gray-800">{mahal.contact}</p>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <div className="pt-6">
              <Link to={`/book/${id}`} className="block">
                <button className="w-full bg-gradient-to-r from-rose-700 to-rose-900 text-white py-4 rounded-xl font-semibold tracking-wide hover:from-rose-800 hover:to-black transition shadow-xl shadow-rose-200/50 mb-4 flex justify-center items-center gap-2">
                  Check Availability
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </Link>

              <Link to={`/brochure/${id}`} className="block">
                <button className="w-full bg-white border-2 border-rose-700 text-rose-700 py-4 rounded-xl font-semibold tracking-wide hover:bg-rose-50 transition mb-4">
                  Request Pricing Brochure
                </button>
              </Link>

              {user?.id !== mahal.owner_id && (
                <Link to={`/chat/${id}/${mahal.owner_id}`} className="block">
                  <button className="w-full bg-amber-50 border-2 border-amber-200 text-amber-900 py-4 rounded-xl font-semibold tracking-wide hover:bg-amber-100 transition mb-6 flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat with Owner
                  </button>
                </Link>
              )}

              {/* Management Actions */}
              {(canEdit || canDelete) && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-400 uppercase font-semibold tracking-widest mb-3">Admin Controls</p>
                  <div className="flex gap-3">
                    {canEdit && (
                      <Link to={`/update/${id}`} className="flex-1">
                        <button className="w-full bg-amber-100 text-amber-800 py-3 rounded-lg font-medium hover:bg-amber-200 transition">
                          Edit Venue
                        </button>
                      </Link>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MahalDetails;