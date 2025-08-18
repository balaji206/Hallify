import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin, CheckCircle, DollarSign, Headphones, Shield } from "lucide-react";
import heroImage from "../assets/michu-dang-quang-unItqGJIlRY-unsplash.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import VanillaTilt from "vanilla-tilt";

function Home() {
  const [mahals, setMahals] = useState([]);
  const [location, setLocation] = useState("");

  const TamilNadu = [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
    "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal",
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur",
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur",
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
  ];

  const fetchMahals = async () => {
    try {
      const res = await axios.get("https://hallify.onrender.com/api/mahal/get", { params: { location } });
      setMahals(res.data);
    } catch (err) {
      console.error("Failed to fetch mahals:", err);
    }
  };

  useEffect(() => {
    fetchMahals();
    AOS.init({ duration: 1000, once: true });
  }, [location]);

  useEffect(() => {
    const cards = document.querySelectorAll(".tilt-card");
    VanillaTilt.init(cards, { max: 10, speed: 400, glare: true, "max-glare": 0.3 });
  }, [mahals]);

  return (
    <div className="scroll-smooth font-sans bg-white text-gray-900">
      <Navbar />

      {/* ✅ Hero Section */}
      <section
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#ffffff] to-transparent"></div>
        <div
          className="relative text-center text-white z-10 max-w-3xl px-4"
          data-aos="zoom-in"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Find the Perfect Venue for Your Big Day
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Explore premium wedding halls across Tamil Nadu with ease.
          </p>
          <a
            href="#locations"
            className="bg-gradient-to-r from-indigo-200 to-indigo-400 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            Start Exploring
          </a>
        </div>
      </section>

      {/* ✅ Popular Locations */}
      <section className="py-16 bg-gray-50 text-center" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-12">Popular Locations</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Chennai", img: "https://media.istockphoto.com/id/157185013/photo/modern-hall.webp?a=1&b=1&s=612x612&w=0&k=20&c=dwFq8iSuoNQ1qLgZlNWsh3jhN348qUR_kPEonsgTPy0=" },
            { name: "Coimbatore", img: "https://media.istockphoto.com/id/1808836071/photo/luxury-hotel-lobby-with-reception-desk-lounge-area-potted-plants-and-chandelier.webp?a=1&b=1&s=612x612&w=0&k=20&c=yTwO2CZMtdxa9wROOJDDGFyUcqbrJNUHjWntZcQ9jKY=" },
            { name: "Madurai", img: "https://images.unsplash.com/photo-1542665952-14513db15293?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDI%3D" },
            { name: "Salem", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDI%3D" },
          ].map((city, index) => (
            <div
              key={index}
              onClick={() => setLocation(city.name)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-48 object-cover group-hover:brightness-75 transition"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition">
                {city.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Why Choose Us */}
      <section className="py-16 text-center bg-gray-50" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <CheckCircle className="text-green-500 w-12 h-12 mb-4" />, title: "Verified Venues" },
            { icon: <DollarSign className="text-amber-500 w-12 h-12 mb-4" />, title: "Best Price Guarantee" },
            { icon: <Shield className="text-blue-500 w-12 h-12 mb-4" />, title: "Secure Booking" },
            { icon: <Headphones className="text-indigo-500 w-12 h-12 mb-4" />, title: "24/7 Support" },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              {feature.icon}
              <h3 className="font-semibold text-lg">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="py-16 bg-white text-center" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Priya R", feedback: "Booking was seamless and stress-free!" },
            { name: "Karthik M", feedback: "Best prices and excellent support!" },
            { name: "Anitha S", feedback: "Found the perfect venue in minutes!" },
          ].map((review, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
              <p className="italic text-gray-700 mb-4">“{review.feedback}”</p>
              <h4 className="font-semibold text-indigo-600">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Quick Search (Moved Near Featured Venues) */}
      <section id="locations" className="py-16 px-6 bg-white" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center mb-6">Quick Search</h2>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-gray-50 p-6 rounded-3xl shadow-xl">
          <div className="relative w-full flex-1">
            <MapPin className="absolute left-4 top-4 text-amber-500" />
            <select
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-4 pl-12 text-lg rounded-full border border-gray-200 shadow focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              <option value="">All Locations</option>
              {TamilNadu.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <Link to="/filter">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-md">
              More Filters ➤
            </button>
          </Link>
        </div>
      </section>

      {/* ✅ Featured Venues */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-8" data-aos="fade-bottom">Featured Venues</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-8 max-w-6xl mx-auto">
          {mahals.slice(0, 6).map((mahal, index) => (
            <Link
              key={mahal._id}
              to={`/mahal/${mahal.id}`}
              className="tilt-card bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition"
              data-aos="fade-left"
              data-aos-delay={index * 100}
            >
              <img
                src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
                alt={mahal.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{mahal.name}</h3>
                <p className="text-gray-600">{mahal.location}</p>
                <p className="text-indigo-500 font-semibold mt-2">₹{mahal.price}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/mahals">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold">
              View All Venues
            </button>
          </Link>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p>📍 Tamil Nadu, India</p>
        <p>📞 +91 98765 43210</p>
        <p>📧 info@mahalbooking.com</p>
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" className="hover:text-amber-400">Facebook</a>
          <a href="#" className="hover:text-amber-400">Instagram</a>
          <a href="#" className="hover:text-amber-400">Twitter</a>
        </div>
        <p className="mt-8 text-sm text-gray-400">© 2025 Mahal Booking. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
