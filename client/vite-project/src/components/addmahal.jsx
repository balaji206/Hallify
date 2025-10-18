import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/engin-akyurt-i3rFV6ULk-o-unsplash.jpg";

function AddMahal() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
    contact: "", // ✅ Added contact number
  });

  const TamilNadu = [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi",
    "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
    "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("image", image);

      const res = await axios.post("http://localhost:5000/api/mahal/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message || "Mahal added successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to add Mahal");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <button className="text-gray-200 font-semibold hover:text-white bg-gradient-to-r from-indigo-200 to-indigo-300 p-2 px-4 rounded-full shadow-lg">
          ← Back
        </button>
      </Link>

      {/* Form Container */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl w-full max-w-2xl p-8 z-10">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Add Your Mahal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Mahal Name"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={handleChange}
            required
          />

          {/* Location */}
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          >
            <option value="">Select Location</option>
            {TamilNadu.map((district, index) => (
              <option key={index} value={district} className="text-black">
                {district}
              </option>
            ))}
          </select>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ Contact Number */}
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            pattern="[0-9]{10}" // Validates for 10-digit number
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={handleChange}
          ></textarea>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
            required
          />

          {/* Image Preview */}
          {preview && (
            <div className="mb-4 relative w-fit mx-auto">
              <img src={preview} alt="Preview" className="rounded-xl max-h-56 shadow-lg" />
              <button
                type="button"
                className="absolute -top-3 -right-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              >
                ×
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-white py-3 rounded-xl font-bold hover:scale-105 transform transition duration-300 shadow-md"
          >
            Add Mahal
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMahal;
