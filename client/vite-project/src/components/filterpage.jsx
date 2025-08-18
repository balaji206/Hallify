import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const FilterPage = () => {
  const [mahals, setMahals] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    budget: "",
    capacity: "",
    amenities: {
      ac: false,
      parking: false,
      decoration: false,
    },
    sort: "",
  });

  const TamilNadu = [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
    "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const fetchMahals = async () => {
    try {
      const res = await axios.get("https://hallify.onrender.com/api/mahal/get", {
        params: filters,
      });
      setMahals(res.data);
    } catch (error) {
      console.error("Error fetching mahals:", error);
    }
  };

  useEffect(() => {
    fetchMahals();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: !prev.amenities[amenity] },
    }));
  };

  const applyFilters = () => {
    fetchMahals();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 font-sans">  {/* Reduced px from 6 → 2 */}
  <div className="max-w-[1400px] mx-auto flex gap-10">
        
        {/* ✅ Sidebar Filters (Fixed Width, Far Left) */}
        <div className="w-80 bg-white p-6 rounded-3xl shadow-lg sticky top-8 h-fit -ml-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-amber-500" />
              <select
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full p-3 pl-12 text-base rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
              >
                <option value="">All Locations</option>
                {TamilNadu.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Budget</label>
            <select
              onChange={(e) => handleChange("budget", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
            >
              <option value="">Any</option>
              <option value="0-50000">Below ₹50,000</option>
              <option value="50000-100000">₹50,000 - ₹1,00,000</option>
              <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
              <option value="200000+">Above ₹2,00,000</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Capacity</label>
            <select
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
            >
              <option value="">Any</option>
              <option value="100">Up to 100</option>
              <option value="500">100 - 500</option>
              <option value="1000">500 - 1000</option>
              <option value="1000+">Above 1000</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Sort By</label>
            <select
              onChange={(e) => handleChange("sort", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
            >
              <option value="">Default</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>

          {/* Amenities */}
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
            <div className="flex flex-col gap-3">
              {["ac", "parking", "decoration"].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={filters.amenities[amenity]}
                    onChange={() => handleAmenityChange(amenity)}
                    className="w-5 h-5 accent-amber-500"
                  />
                  {amenity.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className="w-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition"
          >
            Apply Filters
          </button>
        </div>

        {/* ✅ Results Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Venues</h1>
          {mahals.length === 0 ? (
            <p className="text-gray-500 text-lg">No venues found. Try changing filters.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mahals.map((mahal, index) => (
                <Link
    key={mahal._id}
    to={`/mahal/${mahal.id}`} // ✅ Correct dynamic route
    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition block"
  >
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition"
                >
                  <img
                    src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
                    alt={mahal.name}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-1">{mahal.name}</h3>
                    <p className="text-gray-600">{mahal.location}</p>
                    <p className="text-indigo-500 font-semibold mt-2">₹{mahal.price}</p>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
