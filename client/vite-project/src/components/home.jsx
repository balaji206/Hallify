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
    <div className="scroll-smooth font-sans bg-[#fdfbf7] text-gray-800">
      <Navbar />

      {/* ✅ Hero Section */}
      <section
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50"></div>
        <div
          className="relative text-center text-white z-10 max-w-4xl px-4 mt-16"
          data-aos="zoom-in"
        >
          <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4">
            Curated For Excellence
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight mb-6 drop-shadow-lg">
            Find the Perfect Venue for Your Big Day
          </h1>
          <p className="text-lg md:text-2xl mb-10 opacity-90 font-light max-w-2xl mx-auto">
            Explore premium wedding halls and majestic banquets across Tamil Nadu.
          </p>
          <button
            onClick={() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-rose-700 to-rose-900 px-10 py-4 rounded-full text-lg font-serif tracking-wider shadow-xl shadow-rose-900/30
              transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-2xl border border-rose-500/30"
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* ✅ Popular Locations */}
      <section className="py-20 text-center relative" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-serif text-rose-900 mb-12 flex flex-col items-center gap-3">
          Popular Locations
          <div className="w-24 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 rounded-full"></div>
        </h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
          {[
            { name: "Chennai", img: "https://media.istockphoto.com/id/157185013/photo/modern-hall.webp?a=1&b=1&s=612x612&w=0&k=20&c=dwFq8iSuoNQ1qLgZlNWsh3jhN348qUR_kPEonsgTPy0=" },
            { name: "Coimbatore", img: "https://media.istockphoto.com/id/1808836071/photo/luxury-hotel-lobby-with-reception-desk-lounge-area-potted-plants-and-chandelier.webp?a=1&b=1&s=612x612&w=0&k=20&c=yTwO2CZMtdxa9wROOJDDGFyUcqbrJNUHjWntZcQ9jKY=" },
            { name: "Madurai", img: "https://images.unsplash.com/photo-1542665952-14513db15293?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDI%3D" },
            { name: "Salem", img: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDI%3D" },
          ].map((city, index) => (
            <div
              key={index}
              onClick={() => setLocation(city.name)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden shadow-lg border border-amber-100 hover:shadow-2xl hover:shadow-rose-900/20 transition-all duration-500"
            >
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-6 text-white text-2xl font-serif font-semibold group-hover:from-rose-900/90 transition-all duration-500">
                {city.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Why Choose Us */}
      <section className="py-20 text-center bg-rose-50/50 border-y border-rose-100" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-serif text-rose-900 mb-12 flex flex-col items-center gap-3">
          Why Choose Us?
          <div className="w-24 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 rounded-full"></div>
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {[
            { icon: <CheckCircle className="text-rose-600 w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />, title: "Verified Venues", desc: "Handpicked for premium quality." },
            { icon: <DollarSign className="text-amber-500 w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />, title: "Best Price Guarantee", desc: "Transparent and competitive rates." },
            { icon: <Shield className="text-rose-600 w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />, title: "Secure Booking", desc: "100% safe and verified transactions." },
            { icon: <Headphones className="text-amber-500 w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />, title: "24/7 Support", desc: "Dedicated assistance at every step." },
          ].map((feature, index) => (
            <div key={index} className="p-8 bg-white rounded-2xl shadow-sm border border-rose-50 hover:shadow-xl hover:border-rose-200 transition-all duration-300 group flex flex-col items-center">
              <div className="bg-rose-50 p-4 rounded-full mb-2">{feature.icon}</div>
              <h3 className="font-serif text-xl text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Quick Search */}
      <section id="locations" className="py-20 px-6 bg-[#fdfbf7]" data-aos="fade-up">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-rose-900/5 border border-amber-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0"></div>
          <h2 className="text-3xl font-serif text-rose-900 mb-8 text-center relative z-10">Find Your Grand Venue</h2>
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <div className="relative w-full flex-1">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-600 w-6 h-6" />
              <select
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 pl-14 text-lg rounded-full border-2 border-gray-100 bg-gray-50 text-gray-700 shadow-sm focus:outline-none focus:border-rose-300 focus:bg-white transition-all appearance-none"
              >
                <option value="">Search across all districts...</option>
                {TamilNadu.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <Link to="/filter" className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2 font-serif tracking-wide">
                More Filters
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Featured Venues */}
      <section className="py-20 bg-transparent text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-rose-900 mb-12 flex flex-col items-center gap-3" data-aos="fade-bottom">
          Featured Venues
          <div className="w-24 h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200 rounded-full"></div>
        </h2>

        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-10 max-w-7xl mx-auto px-6">
          {mahals.slice(0, 6).map((mahal, index) => (
            <Link
              key={mahal._id || mahal.id}
              to={`/mahal/${mahal.id}`}
              className="tilt-card group block h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-300"
              data-aos="fade-left"
              data-aos-delay={index * 100}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
                  alt={mahal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-rose-800 tracking-wider uppercase shadow-sm">
                  Premium
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow text-left">
                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold uppercase tracking-widest mb-2">
                  <MapPin className="w-4 h-4" />
                  {mahal.location}
                </div>
                <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-rose-800 transition-colors">{mahal.name}</h3>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Starting at</p>
                    <p className="text-xl font-serif text-rose-700 font-bold">₹{mahal.price}</p>
                  </div>
                  <span className="text-rose-700 bg-rose-50 p-2 rounded-full group-hover:bg-rose-700 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <Link to="/mahals">
            <button className="bg-white border-2 border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white px-10 py-4 rounded-full font-serif tracking-widest uppercase font-semibold transition-all duration-300 shadow-lg">
              View All Venues
            </button>
          </Link>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="py-24 bg-rose-900 text-white text-center relative overflow-hidden" data-aos="fade-up">
        {/* Subtle background pattern/glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-800/50 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {[
              { name: "Priya R", feedback: "Booking was seamless and stress-free! The venue was exactly as shown." },
              { name: "Karthik M", feedback: "Best prices and excellent support! Highly recommend for grand weddings." },
              { name: "Anitha S", feedback: "Found the perfect majestic venue in minutes. A truly premium experience." },
            ].map((review, index) => (
              <div key={index} className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-rose-700/50 shadow-xl">
                <div className="text-amber-400 text-4xl font-serif mb-4">"</div>
                <p className="italic text-rose-100 mb-6 text-lg leading-relaxed">"{review.feedback}"</p>
                <h4 className="font-serif font-semibold text-amber-300 text-xl">- {review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-[#1a0f14] text-rose-100 py-16 text-center border-t-4 border-rose-900">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-white mb-6 tracking-wide">Get in Touch</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-gray-300 mb-10">
            <p className="flex items-center gap-2"><MapPin className="text-amber-500 w-5 h-5" /> Tamil Nadu, India</p>
            <p className="flex items-center gap-2"><Headphones className="text-amber-500 w-5 h-5" /> +91 98765 43210</p>
            <p className="flex items-center gap-2">📧 info@mahalbooking.com</p>
          </div>
          <div className="flex justify-center gap-8 mt-6 border-b border-rose-900/50 pb-10">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-widest text-sm font-semibold">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-widest text-sm font-semibold">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors uppercase tracking-widest text-sm font-semibold">Twitter</a>
          </div>
          <p className="mt-8 text-sm text-gray-500 font-serif tracking-wider">© 2025 Mahal Booking. Curating Grandeur.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;