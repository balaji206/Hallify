import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Mahals() {
  const [mahals, setMahals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://hallify.onrender.com/api/mahal/get')
      .then((res) => {
        setMahals(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading mahals:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans text-gray-800">
      <Navbar />

      {/* Page Header Section */}
      <div className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl translate-x-1/3"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-3">
            Handpicked Collection
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-rose-900 mb-6 drop-shadow-sm">
            Discover Grand Venues
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our exclusive selection of exquisite mahals and banquet halls, perfectly curated for your unforgettable celebrations and grand occasions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 mx-auto mt-8 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative z-10">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-800 rounded-full animate-spin"></div>
            <div className="text-xl font-serif text-rose-800">Curating Venues...</div>
          </div>
        ) : mahals.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-gray-600">No venues available at the moment.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {mahals.map((mahal) => (
              <Link to={`/mahal/${mahal.id}`} key={mahal.id} className="group block h-full">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">

                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
                      alt={mahal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-rose-800 tracking-wider uppercase shadow-sm">
                      Premium
                    </div>

                    {/* Price Tag Overlapping Image */}
                    <div className="absolute bottom-4 right-4 bg-rose-700 text-white px-4 py-2 rounded-xl shadow-lg border border-rose-600/50 backdrop-blur-md">
                      <div className="text-xl font-serif font-bold">₹{mahal.price}</div>
                      <div className="text-[10px] uppercase tracking-wider text-rose-200 font-medium">Per Day</div>
                    </div>
                  </div>

                  {/* Card Content Section */}
                  <div className="p-6 flex flex-col flex-grow">

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase tracking-widest mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {mahal.location}
                    </div>

                    {/* Venue Name */}
                    <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-rose-800 transition-colors">
                      {mahal.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                      {mahal.description}
                    </p>

                    {/* Card Footer Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">

                      {/* Capacity */}
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Up to {mahal.capacity}
                      </div>

                      {/* Explore Link */}
                      <span className="text-rose-700 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Venue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>

                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Mahals;