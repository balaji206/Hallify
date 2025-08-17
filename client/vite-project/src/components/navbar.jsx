import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role) {
        setUserRole(user.role);
      }
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    // ✅ Update on localStorage changes
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Update navbar when route changes
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname]);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav
  className={`fixed w-full top-0 z-50 px-6 py-4 transition duration-300 ${
    scrolled || location.pathname !== "/"
      ? "bg-opacity-60 backdrop-blur-sm shadow-lg"
      : "bg-opacity-60 backdrop-blur-sm"
  }`}
>
      <div className="flex items-center justify-between w-full px-4">
        <div
          className={`text-xl font-bold ${
            scrolled || location.pathname !== "/" ? "text-black" : "text-white"
          }`}
        >
          Book your Space
        </div>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex space-x-6 font-medium ${
            scrolled || location.pathname !== "/" ? "text-black" : "text-white"
          }`}
        >
          <li className="hover:text-gray-300">
            <Link to="#">Home</Link>
          </li>
          {isLoggedIn && (
            <li className="hover:text-gray-300">
              <Link to="/upload">Add Mahal</Link>
            </li>
          )}

          {!isLoggedIn ? (
            <>
              <li className="hover:text-gray-300">
                <Link to="/register">Signup</Link>
              </li>
              <li className="hover:text-gray-300">
                <Link to="/login">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={handleLogout} className="hover:text-red-400">
                  Logout
                </button>
              </li>
              <li>
                <Link to="/profile" title="Profile">
                  <User
                    className={`w-6 h-6 hover:text-yellow-500 transition ${
                      scrolled || location.pathname !== "/"
                        ? "text-black"
                        : "text-white"
                    }`}
                  />
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg
            className={`w-6 h-6 ${
              scrolled || location.pathname !== "/" ? "text-black" : "text-white"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul
          className={`md:hidden mt-4 space-y-3 font-medium px-4 ${
            scrolled || location.pathname !== "/" ? "text-black" : "text-white"
          }`}
        >
          <li>
            <Link to="/" className="block hover:text-gray-500">
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/upload" className="block hover:text-gray-500">
                Add Mahal
              </Link>
            </li>
          )}
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/register" className="block hover:text-gray-500">
                  Signup
                </Link>
              </li>
              <li>
                <Link to="/login" className="block hover:text-gray-500">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" className="block hover:text-gray-500">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block hover:text-red-400"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
