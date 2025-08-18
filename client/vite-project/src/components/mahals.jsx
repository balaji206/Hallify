import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Mahals() {
  const [mahals, setMahals] = useState([]);

  useEffect(() => {
    axios.get('https://hallify.onrender.com/api/mahal/get')
      .then((res) => setMahals(res.data))
      .catch((err) => console.error('Error loading mahals:', err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-6 py-10 bg-amber-50 min-h-screen">
        <h2 className="text-3xl font-semibold text-amber-900 mb-8 text-center mt-10">All Mahals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mahals.map((mahal) => (
            <Link to={`/mahal/${mahal.id}`} key={mahal.id}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transition duration-300">
                <img
                  src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
                  alt={mahal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-amber-900">{mahal.name}</h3>
                  <p className="text-gray-700">{mahal.location}</p>
                  <p className="text-gray-600 text-sm">{mahal.description}</p>
                  <p className="text-red-700 font-bold mt-2">₹{mahal.price}</p>
                  <p className="text-sm text-gray-500">Capacity: {mahal.capacity}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mahals;
