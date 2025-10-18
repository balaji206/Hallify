import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import signuppage from "../assets/engin-akyurt-i3rFV6ULk-o-unsplash.jpg";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
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
      const res = await axios.post("http://localhost:5000/api/users/send-otp", {
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
      const verifyRes = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: formData.email,
        otp,
      });

      if (verifyRes.data.message === "OTP verified") {
        // Proceed to register
        const res = await axios.post("http://localhost:5000/api/users/register", formData);
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${signuppage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <Link to="/">
        <button className="absolute top-6 left-6 text-white font-semibold hover:text-gray-300 from-gray-50 to-gray-400 bg-blur p-2 px-4 rounded-2xl z-10">
          Back
        </button>
      </Link>

      <form
        onSubmit={otpSent ? handleOtpSubmit : sendOtp}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md min-h-[30rem] flex flex-col justify-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Signup
        </h2>

        {/* Step 1: User Info */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-gray-200 border border-white/30 focus:outline-none"
          onChange={handleChange}
          required
        >
          <option value="user" className="text-black">User</option>
          <option value="owner" className="text-black">Owner</option>
        </select>

        {/* Step 2: OTP Input */}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-300 font-semibold"
        >
          {otpSent ? (isVerifying ? "Verifying..." : "Verify & Signup") : "Send OTP"}
        </button>

        <p className="text-center text-gray-200 text-sm pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
