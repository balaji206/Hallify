// Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import signuppage from "../assets/engin-akyurt-i3rFV6ULk-o-unsplash.jpg";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://hallify.onrender.com/api/users/send-otp", {
        email: formData.email,
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const verifyRes = await axios.post("https://hallify.onrender.com/api/users/verify-otp", 
         {
        email: formData.email,
        otp,
      });

      if (verifyRes.data.message === "OTP verified") {
        const res = await axios.post("https://hallify.onrender.com/api/users/register", formData);
        alert(res.data.message);
        navigate("/login");
      } else {
        alert("OTP verification failed");
      }
    } catch (err) {
      alert("Error verifying OTP or registering");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans"
      style={{
        backgroundImage: `url(${signuppage})`,
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
        onSubmit={otpSent ? handleOtpSubmit : sendOtp}
        className="relative z-10 bg-[#1a0f14]/60 backdrop-blur-xl border border-rose-900/50 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(136,19,55,0.3)] w-full max-w-md min-h-[30rem] flex flex-col justify-center"
      >
        <div className="text-center mb-8">
          <p className="text-amber-400 font-semibold tracking-widest uppercase text-xs mb-2">Join The Elite</p>
          <h2 className="text-4xl font-serif font-bold text-white drop-shadow-md">
            Begin Your Journey
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Step 1: User Info */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full p-4 mb-4 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all shadow-inner"
          onChange={handleChange}
          required
        />
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
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Step 2: OTP Input */}
        {otpSent && (
          <div className="animate-fade-in-up">
            <input
              type="text"
              placeholder="Enter Security OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-4 mb-6 rounded-xl bg-amber-500/10 text-amber-300 placeholder-amber-700/50 border border-amber-500/50 focus:outline-none focus:border-amber-400 focus:bg-amber-500/20 transition-all text-center tracking-widest text-lg font-bold shadow-inner"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-700 to-rose-900 text-white py-4 rounded-xl hover:from-rose-800 hover:to-black transition-all duration-300 font-serif tracking-widest uppercase font-bold shadow-xl border border-rose-500/30 group flex justify-center items-center gap-2"
        >
          {otpSent ? (isVerifying ? "Verifying..." : "Verify & Reserve") : "Secure Signup"}
        </button>

        <p className="text-center text-gray-400 text-sm pt-6 font-serif tracking-wide">
          Already a member?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline decoration-amber-500/30 underline-offset-4">
            Access Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;