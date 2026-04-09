import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, MessageSquare } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Calculate unread messages from localStorage
  const calculateUnread = () => {
    try {
      const chats = JSON.parse(localStorage.getItem("hallify_chats") || "{}");
      const userString = localStorage.getItem("user");
      if (!userString) return 0;
      const currentUser = JSON.parse(userString);
      
      let total = 0;
      Object.values(chats).forEach(chat => {
        // Count messages that were NOT sent by current user and are marked unread
        chat.messages.forEach(msg => {
          if (msg.senderId !== currentUser.id && msg.unread) {
            total++;
          }
        });
      });
      setUnreadCount(total);
    } catch (e) {
      console.error("Error calc unread:", e);
    }
  };

  // ✅ Check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role) {
        setUserRole(user.role);
      }
      calculateUnread();
    } else {
      setUserRole(null);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    // ✅ Update on localStorage changes
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener("storage", handleStorageChange);

    // Refresh count occasionally since it's local
    const interval = setInterval(calculateUnread, 3000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
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
      : scrolled ? "bg-white/80" : "bg-transparent text-white"
  }`}
  style={{
    backgroundColor: scrolled || location.pathname !== "/" ? "rgba(255, 255, 255, 0.8)" : "transparent",
    color: scrolled || location.pathname !== "/" ? "black" : "white"
  }}
>
      <div className="flex items-center justify-between w-full px-4">
        <Link to='/'>
        <div
          className={`text-xl font-bold font-serif tracking-widest uppercase ${
            scrolled || location.pathname !== "/" ? "text-rose-900" : "text-white"
          }`}
        >
          Hallify
        </div>
        </Link>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex items-center space-x-8 font-medium ${
            scrolled || location.pathname !== "/" ? "text-gray-800" : "text-white"
          }`}
        >
          <li className="hover:text-amber-500 transition-colors">
            <Link to="/">Home</Link>
          </li>
          {isLoggedIn && (
            <li className="hover:text-amber-500 transition-colors">
              <Link to="/upload">Add Mahal</Link>
            </li>
          )}

          {!isLoggedIn ? (
            <>
              <li className="hover:text-amber-500 transition-colors">
                <Link to="/register">Signup</Link>
              </li>
              <li className="bg-rose-800 text-white px-6 py-2 rounded-full hover:bg-rose-950 transition-all shadow-lg text-sm uppercase tracking-widest font-bold">
                <Link to="/login">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/messages" className="relative group">
                  <MessageSquare
                    className={`w-6 h-6 hover:text-amber-500 transition-all ${
                      scrolled || location.pathname !== "/"
                        ? "text-gray-700"
                        : "text-white"
                    }`}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/profile" title="Profile">
                  <User
                    className={`w-6 h-6 hover:text-amber-500 transition-all ${
                      scrolled || location.pathname !== "/"
                        ? "text-gray-700"
                        : "text-white"
                    }`}
                  />
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors">
                  Logout
                </button>
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
