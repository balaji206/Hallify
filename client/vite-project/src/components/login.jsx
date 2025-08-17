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

      // ✅ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/"); // redirect to home or dashboard
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${loginimage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button */}
      <Link to="/">
        <button className="absolute top-6 left-6 text-white font-semibold hover:text-gray-300 bg-indigo-700 p-2 px-4 rounded-2xl z-10">
          Back
        </button>
      </Link>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md min-h-[25rem] flex flex-col justify-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Login
        </h2>

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
          <option value="user" className="text-black">
            User
          </option>
          <option value="owner" className="text-black">
            Owner
          </option>
          <option value="admin" className="text-black">
            Admin
          </option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-300 font-semibold"
        >
          Login
        </button>

        <p className="text-center text-gray-200 text-sm pt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
