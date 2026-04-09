// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import loginimage from "../assets/engin-akyurt-i3rFV6ULk-o-unsplash.jpg";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        role: role.toLowerCase(),
      });

      const token = res.data.token;
      const user = res.data.user;

      alert("Login successful ✅");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans"
      style={{
        backgroundImage: `url(${loginimage})`,
      }}
    >
      {/* Luxury Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#1a0f14]/90"></div>

      {/* Elegant Back Navigation */}
      <Link to="/" className="absolute top-8 left-8 z-20">
        <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full hover:bg-white/20 hover:scale-105 transition-all font-serif tracking-widest uppercase text-xs shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return
        </button>
      </Link>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-[#1a0f14]/60 backdrop-blur-xl border border-rose-900/50 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(136,19,55,0.3)] w-full max-w-md min-h-[25rem] flex flex-col justify-center"
      >
        <div className="text-center mb-8">
          <p className="text-amber-400 font-semibold tracking-widest uppercase text-xs mb-2">Welcome Back</p>
          <h2 className="text-4xl font-serif font-bold text-white drop-shadow-md">
            Access Account
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-4 mb-4 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all shadow-inner"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-4 mb-4 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all shadow-inner"
          onChange={handleChange}
          required
        />

        <div className="relative mb-6">
          <select
            name="role"
            className="w-full p-4 rounded-xl bg-white/5 text-gray-200 border border-white/10 focus:outline-none focus:border-amber-500 transition-all shadow-inner appearance-none cursor-pointer"
            onChange={handleChange}
            required
          >
            <option value="user" className="text-gray-900 bg-white">Guest / User</option>
            <option value="owner" className="text-gray-900 bg-white">Venue Owner</option>
            <option value="admin" className="text-gray-900 bg-white">Administrator</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-500">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-700 to-rose-900 text-white py-4 rounded-xl hover:from-rose-800 hover:to-black transition-all duration-300 font-serif tracking-widest uppercase font-bold shadow-xl border border-rose-500/30 mt-2"
        >
          Authenticate
        </button>

        <p className="text-center text-gray-400 text-sm pt-6 font-serif tracking-wide">
          Not part of the elite yet?{" "}
          <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline decoration-amber-500/30 underline-offset-4">
            Apply Now
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;