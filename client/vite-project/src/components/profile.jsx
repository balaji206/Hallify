import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle, ArrowLeft, LogOut, CalendarCheck, Star, Heart, Building, Users, Clock, ShieldCheck, MapPin, Hash, CheckCircle2, Trash2, ShieldAlert, Edit, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [ownerMahals, setOwnerMahals] = useState([]);
    const [ownerBookings, setOwnerBookings] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allMahals, setAllMahals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token")?.trim().replace(/[\r\n]+/g, '');
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Basic Profile
        axios.get("https://hallify.onrender.com/api/users/get", { headers })
            .then(res => {
                const user = res.data;
                setProfile(user);

                // 2. Conditional Dashboard Fetching
                if (user.role === 'user') {
                    return axios.get("https://hallify.onrender.com/api/booking/user", { headers });
                } else if (user.role === 'owner') {
                    return Promise.all([
                        axios.get("https://hallify.onrender.com/api/mahal/owner", { headers }),
                        axios.get("https://hallify.onrender.com/api/booking/owner", { headers })
                    ]);
                } else if (user.role === 'admin') {
                    return Promise.all([
                        axios.get("https://hallify.onrender.com/api/users/all", { headers }),
                        axios.get("https://hallify.onrender.com/api/mahal/get", { headers }),
                        axios.get("https://hallify.onrender.com/api/booking/all", { headers })
                    ]);
                }
            })
            .then(res => {
                if (!res) return;
                if (Array.isArray(res)) {
                    // Owner or Admin (Multi-fetch)
                    if (profile?.role === 'owner' || (res.length === 2 && !Array.isArray(res[0].data))) {
                        // This logic is a bit brittle, checking types is safer
                    }

                    // Specific mapping
                    if (profile?.role === 'owner') {
                        setOwnerMahals(res[0].data);
                        setOwnerBookings(res[1].data);
                    } else {
                        setAllUsers(res[0].data);
                        setAllMahals(res[1].data || []);
                        setOwnerBookings(res[2]?.data || []); // Use ownerBookings state for 'allBookings' in admin
                    }
                } else {
                    // User (Single fetch)
                    setUserBookings(res.data);
                }
            })
            .catch(err => console.error("❌ Error fetching dashboard data:", err))
            .finally(() => setLoading(false));
    }, [profile?.role]);

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const handleRoleChange = async (userId, newRole) => {
        const token = localStorage.getItem("token")?.trim();
        try {
            await axios.patch(`https://hallify.onrender.com/api/users/role/${userId}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error("Role Update Error:", err);
            alert("Failed to update user role.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently remove this user account and all their associated listings/bookings?")) return;

        const token = localStorage.getItem("token")?.trim();
        try {
            await axios.delete(`https://hallify.onrender.com/api/users/delete/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error("Delete Error:", err);
            alert(err.response?.data?.message || "Failed to delete user.");
        }
    };

    const handleDeleteMahal = async (mahalId) => {
        if (!window.confirm("Are you sure you want to remove this venue listing?")) return;

        const token = localStorage.getItem("token")?.trim();
        try {
            // Reusing owner delete if permitted or generic delete
            await axios.delete(`https://hallify.onrender.com/api/mahal/delete/${mahalId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllMahals(prev => prev.filter(m => m.id !== mahalId));
        } catch (err) {
            console.error("Mahal Delete Error:", err);
            alert("Failed to remove venue.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-800"></div>
                <p className="text-rose-800 font-serif tracking-widest uppercase text-sm animate-pulse">Initializing Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] font-sans text-gray-800 relative pb-20 overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            {/* Nav */}
            <div className="pt-8 px-6 md:px-12 relative z-20 max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full hover:bg-gray-50 hover:shadow-md transition-all shadow-sm">
                        <ArrowLeft size={18} />
                        <span className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Back</span>
                    </button>
                </Link>
                <button onClick={logout} className="flex items-center gap-2 text-rose-800 font-bold uppercase text-[10px] tracking-widest hover:text-rose-600 transition-colors">
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* Header */}
            <div className="text-center mt-8 mb-12 relative z-10 px-6">
                <div className="inline-block bg-white p-2 rounded-full shadow-md mb-6 border border-rose-50">
                    <UserCircle className="w-20 h-20 text-amber-500 bg-rose-50 rounded-full" strokeWidth={1} />
                </div>
                <h1 className="text-4xl font-serif font-bold text-rose-900 mb-2">{profile.fullName}</h1>
                <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 mb-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-800">{profile.role} Portal</span>
                </div>
                <p className="text-gray-400 text-sm italic">{profile.email}</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Sidebar: Quick Actions */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6 border-b pb-4">Account Overview</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Member Since</span>
                                <span className="text-sm font-bold text-gray-700">{new Date(profile.created_at).getFullYear()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Status</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>

                    {profile.role === 'owner' && (
                        <Link to="/upload">
                            <button className="w-full bg-rose-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg mt-4 flex items-center justify-center gap-2">
                                <Building size={16} /> List New Mahal
                            </button>
                        </Link>
                    )}
                </div>

                {/* Right Area: Dashboard Sections */}
                <div className="lg:col-span-9 space-y-10">

                    {/* --- USER DASHBOARD --- */}
                    {profile.role === 'user' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-serif font-bold text-rose-900">My Reservations</h3>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total: {userBookings.length}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {userBookings.length === 0 ? (
                                    <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
                                        <CalendarCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 italic font-serif">You haven't made any reservations yet.</p>
                                    </div>
                                ) : (
                                    userBookings.map((b) => (
                                        <div key={b.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-800">
                                                    <Building size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900">{b.mahal_name}</h4>
                                                    <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin size={14} /> {b.mahal_location}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-8 border-l border-gray-100 pl-0 md:pl-8">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Event Duration</p>
                                                    <p className="text-sm font-semibold text-gray-700">{new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Status</p>
                                                    <span className="text-[10px] px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-bold uppercase">{b.status}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Paid</p>
                                                    <p className="text-lg font-bold text-rose-800">₹{b.total_price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- OWNER DASHBOARD --- */}
                    {profile.role === 'owner' && (
                        <div className="space-y-12">
                            {/* My Mahals Section */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-serif font-bold text-rose-900">My Venues</h3>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Listed: {ownerMahals.length}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {ownerMahals.map(m => (
                                        <div key={m.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="relative h-40">
                                                <img src={m.image_url ? `https://hallify.onrender.com/uploads/${m.image_url}` : "https://via.placeholder.com/400x200"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-rose-900 shadow-sm">
                                                    ₹{m.price}/day
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-serif font-bold text-xl text-gray-900 mb-1">{m.name}</h4>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mb-4"><MapPin size={12} /> {m.location}</p>
                                                <Link to={`/update/${m.id}`}>
                                                    <button className="w-full py-2.5 bg-rose-50 text-rose-800 rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-rose-900 hover:text-white transition-all">Edit Details</button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Bookings for My Mahals */}
                            <section className="space-y-6">
                                <h3 className="text-2xl font-serif font-bold text-rose-900">Venue Bookings</h3>
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Venue</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Customer</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Dates</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {ownerBookings.map(b => (
                                                    <tr key={b.id} className="hover:bg-rose-50/30 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-gray-800 text-sm">{b.mahal_name}</td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-semibold">{b.user_name}</p>
                                                            <p className="text-[10px] text-gray-400">{b.user_email}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                                            {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <p className="font-bold text-rose-800">₹{b.total_price.toLocaleString()}</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* --- ADMIN DASHBOARD --- */}
                    {profile.role === 'admin' && (
                        <div className="space-y-10">
                            {/* Admin Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-rose-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <Users className="w-10 h-10 text-rose-300 mb-4" />
                                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Total Users</p>
                                        <h3 className="text-4xl font-serif font-bold">{allUsers.length}</h3>
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Users size={120} />
                                    </div>
                                </div>
                                <div className="bg-amber-500 rounded-3xl p-8 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <Building className="w-10 h-10 text-amber-200 mb-4" />
                                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Total Mahals</p>
                                        <h3 className="text-4xl font-serif font-bold">{allMahals.length}</h3>
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Building size={120} />
                                    </div>
                                </div>
                                <div className="bg-rose-100 rounded-3xl p-8 text-rose-900 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <CalendarCheck className="w-10 h-10 text-rose-400 mb-4" />
                                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Success Bookings</p>
                                        <h3 className="text-4xl font-serif font-bold">{ownerBookings.length}</h3>
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 text-rose-900/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CalendarCheck size={120} />
                                    </div>
                                </div>
                            </div>

                            {/* User Management List */}
                            <section className="space-y-6">
                                <h3 className="text-2xl font-serif font-bold text-rose-900">User Management</h3>
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Full Name</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Role</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {allUsers.map(u => (
                                                    <tr key={u.id}>
                                                        <td className="px-6 py-4 font-bold text-gray-800 text-sm">{u.fullName}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={u.role}
                                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                                disabled={u.id === profile.id}
                                                                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-rose-200 cursor-pointer ${u.role === 'admin' ? 'bg-rose-900 text-white' : u.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'} ${u.id === profile.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="owner">Owner</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {u.id !== profile.id && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            {/* Mahal Management List */}
                            <section className="space-y-6">
                                <h3 className="text-2xl font-serif font-bold text-rose-900">Venue Management</h3>
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Venue Name</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Location</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Pricing</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {allMahals.map(m => (
                                                    <tr key={m.id} className="group">
                                                        <td className="px-6 py-4 font-bold text-gray-800 text-sm">{m.name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{m.location}</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-rose-800">₹{m.price}/day</td>
                                                        <td className="px-6 py-4 text-right space-x-2">
                                                            <Link to={`/update/${m.id}`}>
                                                                <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="Edit Venue">
                                                                    <Edit size={16} />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteMahal(m.id)}
                                                                className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                                                                title="Delete Venue"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;