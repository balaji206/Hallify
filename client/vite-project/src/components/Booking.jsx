import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft, CreditCard, Clock, Info, CheckCircle2,ShieldCheck } from "lucide-react";

/**
 * Booking Component
 * Allows users to select dates, see availability, and confirm reservations.
 * Theme: Premium Wedding Venue (Rose & Amber Light Theme)
 */
function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [mahal, setMahal] = useState(null);
    const [user, setUser] = useState(null);
    const [existingBookings, setExistingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: ""
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                let currentUser = null;

                if (token) {
                    const userRes = await axios.get("http://localhost:5000/api/users/get", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    currentUser = userRes.data;
                    setUser(currentUser);
                }

                // Fetch Mahal details
                const mahalRes = await axios.get(`http://localhost:5000/api/mahal/get/${id}`);
                const mahalData = mahalRes.data;
                setMahal(mahalData);

                // Check if the current user is the owner
                if (currentUser && mahalData.owner_id === currentUser.id) {
                    setIsOwner(true);
                }

                // Fetch existing bookings
                const bookingsRes = await axios.get(`http://localhost:5000/api/booking/mahal/${id}`);
                setExistingBookings(bookingsRes.data);
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Calculate dynamic price whenever dates change
    useEffect(() => {
        if (bookingData.startDate && bookingData.endDate && mahal) {
            const start = new Date(bookingData.startDate);
            const end = new Date(bookingData.endDate);
            const diffTime = Math.max(0, end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including both start and end days
            
            if (diffDays > 0) {
                setTotalPrice(diffDays * mahal.price);
            } else {
                setTotalPrice(0);
            }
        }
    }, [bookingData, mahal]);

    const handleInputChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!bookingData.startDate || !bookingData.endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const start = new Date(bookingData.startDate);
        const end = new Date(bookingData.endDate);
        
        if (start > end) {
            alert("Start date cannot be after end date.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to book a venue.");
            navigate("/login");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post("http://localhost:5000/api/booking/create", {
                mahalId: id,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                totalPrice: totalPrice
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data.message || "Reservation confirmed successfully!");
            navigate(`/mahal/${id}`);
        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.message || "Failed to confirm reservation. Please try different dates.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-800"></div>
            <p className="text-rose-800 font-serif tracking-widest uppercase text-sm animate-pulse">Curating Booking Details...</p>
        </div>
    );

    return (
        <div className="bg-[#fdfbf7] min-h-screen text-gray-800 font-sans pb-20">
            {/* Header / Nav */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
                <Link to={`/mahal/${id}`}>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full hover:bg-gray-50 hover:shadow-md transition-all shadow-sm">
                        <ArrowLeft size={18} />
                        <span className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Return to Venue</span>
                    </button>
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-rose-900 tracking-wide drop-shadow-sm">Reserve Your Dates</h1>
                    <p className="text-amber-600 text-xs uppercase tracking-[0.3em] font-bold mt-2">at {mahal?.name || "the venue"}</p>
                </div>
                <div className="hidden md:block w-32"></div> {/* Spacer */}
            </div>

            {!mahal && !loading ? (
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <div className="bg-rose-50 p-12 rounded-[3rem] border border-rose-100 shadow-inner">
                        <Info size={48} className="text-rose-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-rose-900 mb-4">Venue Details Unavailable</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">We encountered a temporary connection issue while curating the details for this grand venue. Please ensure the server is operational and refresh the page.</p>
                        <button onClick={() => window.location.reload()} className="bg-rose-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all">Retry Connection</button>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
                
                {/* Left Side: Booking Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-amber-100 rounded-[2rem] shadow-2xl shadow-rose-900/5 p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-50 rounded-bl-full -z-0"></div>
                        
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                            {/* Date Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-rose-800 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                        <Calendar size={16} className="text-amber-500" /> Start Date
                                    </label>
                                    <input 
                                        type="date" 
                                        name="startDate"
                                        value={bookingData.startDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:border-rose-300 focus:bg-white transition-colors appearance-none shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-rose-800 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                        <Calendar size={16} className="text-amber-500" /> End Date
                                    </label>
                                    <input 
                                        type="date" 
                                        name="endDate"
                                        value={bookingData.endDate}
                                        onChange={handleInputChange}
                                        min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 p-4 rounded-xl focus:outline-none focus:border-rose-300 focus:bg-white transition-colors appearance-none shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Summary / Price */}
                            <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-100 space-y-4">
                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="text-sm font-medium uppercase tracking-wider">Base Price per Day</span>
                                    <span className="font-sans font-bold text-gray-800">₹{mahal?.price?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-800 text-xl pt-4 border-t border-rose-100">
                                    <span className="font-serif font-semibold flex items-center gap-2 text-rose-900">
                                        <Clock size={22} className="text-amber-500" /> Total Investment
                                    </span>
                                    <div className="text-right">
                                        <div className="text-4xl font-serif font-bold text-rose-700 tracking-tight">
                                            ₹{totalPrice.toLocaleString()}
                                        </div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mt-1">Calculated for your stay</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            {isOwner ? (
                                <div className="flex items-start gap-4 p-5 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl">
                                    <ShieldCheck size={24} className="text-rose-600 shrink-0 mt-1" />
                                    <p className="text-sm text-rose-800 leading-relaxed font-bold font-serif">
                                        You are the owner of this venue. To manage reservations or black-out dates, please use your Owner Dashboard. You cannot book your own mahal.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                                    <Info size={24} className="text-amber-600 shrink-0 mt-1" />
                                    <p className="text-sm text-gray-700 leading-relaxed italic font-serif">
                                        Upon confirmation, a formal reservation notification will be dispatched to your registered email and the venue owner simultaneously to finalize the grand arrangements.
                                    </p>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSubmitting || isOwner}
                                className={`w-full ${isOwner ? 'bg-gray-200 cursor-not-allowed text-gray-400 border-gray-300 shadow-none' : 'bg-gradient-to-r from-rose-700 to-rose-900 text-white hover:from-rose-800 hover:to-black shadow-xl shadow-rose-200/50 border-rose-600/30'} py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transform transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group`}
                            >
                                {isSubmitting ? "Finalizing Arrangements..." : (
                                    <>
                                        <CreditCard size={20} className={`${isOwner ? '' : 'group-hover:rotate-12'} transition-transform text-rose-200`} />
                                        {isOwner ? "Booking Restricted (Owner)" : "Confirm Reservation"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Availability / Instructions */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Availability List */}
                    <div className="bg-white border border-gray-100 shadow-xl shadow-rose-900/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                        <h3 className="text-rose-900 font-serif text-2xl font-bold mb-6 border-b border-gray-100 pb-4 flex items-center gap-3">
                            <Clock className="text-amber-500" /> Occupied Dates
                        </h3>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {existingBookings.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="italic text-gray-500 font-serif">The venue is currently wide open for your preferred dates.</p>
                                </div>
                            ) : (
                                existingBookings.map((b, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-rose-50 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <div className="text-sm font-medium text-gray-800">
                                                <span className="text-gray-400 text-xs uppercase tracking-wider mr-1">From</span> 
                                                {new Date(b.start_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-amber-500 font-bold">
                                            →
                                        </div>
                                        <div className="text-sm font-medium text-gray-800">
                                            <span className="text-gray-400 text-xs uppercase tracking-wider mr-1">To</span> 
                                            {new Date(b.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Tips Card */}
                    <div className="bg-gradient-to-br from-rose-900 to-[#1a0f14] rounded-[2rem] p-8 border border-rose-800 shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 opacity-10">
                            <CheckCircle2 size={150} className="text-rose-200" />
                        </div>
                        <h4 className="text-amber-400 font-serif text-xl font-bold mb-6 relative z-10">Booking Protocols</h4>
                        <ul className="space-y-5 relative z-10">
                            {[
                                "Price is computed per calendar day.",
                                "Dual-party instant email verification.",
                                "Non-refundable priority booking.",
                                "Exclusive venue access guaranteed."
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-rose-50 text-sm font-medium leading-relaxed">
                                    <CheckCircle2 size={20} className="text-amber-500 shrink-0" /> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
            )}
            
            {/* Footer Decoration */}
            <div className="flex justify-center items-center mt-20 opacity-30">
                <div className="w-32 h-px bg-gradient-to-r from-transparent to-rose-900"></div>
                <div className="mx-6 text-xl text-rose-900">❖</div>
                <div className="w-32 h-px bg-gradient-to-l from-transparent to-rose-900"></div>
            </div>
        </div>
    );
}

export default Booking;