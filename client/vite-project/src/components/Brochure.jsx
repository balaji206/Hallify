import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  CheckCircle2, 
  Layers, 
  Users, 
  Info,
  Star,
  Clock,
  Utensils,
  Leaf,
  Beef
} from "lucide-react";

/**
 * Brochure Component
 * A digital pricing brochure for a Mahal.
 * Owners can edit pricing, capacity, amenities (with icons), and catering costs.
 */
function Brochure() {
  const { id } = useParams();
  const [mahal, setMahal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    capacity: "",
    amenities: "",
    pricing_details: "",
    description: "",
    veg_price: 450,
    non_veg_price: 650
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // Helper to map amenity text to icons
  const getIcon = (text) => {
    const lowText = text.toLowerCase();
    if (lowText.includes("a/c") || lowText.includes("air condition")) return "❄️";
    if (lowText.includes("valet") || lowText.includes("parking")) return "🚗";
    if (lowText.includes("room")) return "🛏️";
    if (lowText.includes("power") || lowText.includes("backup")) return "🔌";
    if (lowText.includes("catering") || lowText.includes("food")) return "🍽️";
    if (lowText.includes("stage") || lowText.includes("decor")) return "🎭";
    if (lowText.includes("cctv") || lowText.includes("security")) return "📹";
    if (lowText.includes("dj") || lowText.includes("sound")) return "🎵";
    return "✨";
  };

  useEffect(() => {
    const fetchMahal = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/mahal/get/${id}`);
        setMahal(res.data);
        setFormData({
          price: res.data.price,
          capacity: res.data.capacity,
          amenities: res.data.amenities || "",
          pricing_details: res.data.pricing_details || "",
          description: res.data.description || "",
          veg_price: res.data.veg_price || 450,
          non_veg_price: res.data.non_veg_price || 650
        });
        
        if (user && res.data.owner_id === user.id) {
          setIsOwner(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brochure:", err);
        setLoading(false);
      }
    };
    fetchMahal();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/mahal/update/${id}`, {
        ...mahal,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMahal({ ...mahal, ...formData });
      setEditMode(false);
      alert("Brochure updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update brochure.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-800 rounded-full animate-spin"></div>
      <p className="text-rose-800 font-serif tracking-widest uppercase text-sm animate-pulse">Printing Brochure...</p>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans pb-24 text-gray-800">
      
      {/* Dynamic Header */}
      <div className="bg-rose-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-800/20 rounded-full -ml-24 -mb-24"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link to={`/mahal/${id}`} className="inline-flex items-center gap-2 text-rose-200 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft size={16} /> Back to Venue
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2 uppercase">{mahal.name}</h1>
            <p className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs">Dynamic Pricing brochure</p>
          </div>
          
          {isOwner && (
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-xl ${
                editMode ? "bg-white text-rose-900" : "bg-amber-400 text-rose-900 hover:bg-amber-300"
              }`}
            >
              {editMode ? <><X size={18} /> Cancel Editing</> : <><Edit size={18} /> Edit Brochure</>}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-rose-900/10 border border-ruby-50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Column */}
            <div className="p-10 md:p-14 bg-rose-50/30">
              <div className="rounded-3xl overflow-hidden shadow-2xl mb-10 h-64">
                <img src={`http://localhost:5000/uploads/${mahal.image_url}`} className="w-full h-full object-cover" alt={mahal.name} />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-rose-900 font-serif text-2xl font-bold mb-4 flex items-center gap-3">
                    <Info className="text-amber-500" /> About the Venue
                  </h3>
                  {editMode ? (
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-white border-2 border-rose-100 p-4 rounded-xl h-40 focus:outline-none focus:border-rose-400 italic text-gray-700"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed italic font-serif text-lg">"{mahal.description}"</p>
                  )}
                </div>

                <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-rose-100 shadow-sm">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Star size={24} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Premium Quality</p>
                    <p className="font-serif font-bold text-rose-900">Elite Wedding Venue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-10 md:p-14 space-y-12">
              <div className="space-y-6">
                <h3 className="text-rose-900 font-serif text-3xl font-bold">Rental Cost</h3>
                {editMode ? (
                  <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-rose-100">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400">Base Price (₹/day)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3 border-b-2 border-rose-200 focus:border-rose-500 outline-none font-bold text-xl" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400">Included Details</label>
                      <textarea name="pricing_details" value={formData.pricing_details} onChange={handleInputChange} className="w-full p-3 border-b-2 border-rose-200 outline-none text-sm h-16" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400">Capacity</label>
                      <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full p-3 border-b-2 border-rose-200 outline-none" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-5xl font-serif font-bold text-rose-700 tracking-tighter">₹{mahal.price} <span className="text-sm font-sans text-gray-400 font-normal tracking-normal">/ day</span></div>
                    <p className="text-sm text-gray-500 italic">{mahal.pricing_details || "Includes main hall, dining area, and standard lighting."}</p>
                    <p className="text-sm font-bold text-gray-700 mt-2 flex items-center gap-2"><Users size={16} /> Accommodates up to {mahal.capacity} Guests</p>
                  </div>
                )}
              </div>

              {/* Catering Section */}
              <div className="space-y-6">
                <h3 className="text-rose-900 font-serif text-2xl font-bold">Catering (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editMode ? (
                    <>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <label className="text-[10px] uppercase font-bold text-emerald-600">Veg Plate (₹)</label>
                        <input type="number" name="veg_price" value={formData.veg_price} onChange={handleInputChange} className="w-full bg-transparent border-b border-emerald-300 font-bold" />
                      </div>
                      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                        <label className="text-[10px] uppercase font-bold text-rose-600">Non-Veg Plate (₹)</label>
                        <input type="number" name="non_veg_price" value={formData.non_veg_price} onChange={handleInputChange} className="w-full bg-transparent border-b border-rose-300 font-bold" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-emerald-50 h-24 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3"><div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Leaf size={20} /></div><span className="font-bold text-emerald-800">Veg</span></div>
                        <div className="text-right"><p className="text-xl font-black text-emerald-700">₹{mahal.veg_price}</p><p className="text-[8px] uppercase text-emerald-400 font-bold">Per Plate</p></div>
                      </div>
                      <div className="bg-rose-50 h-24 p-5 rounded-2xl border border-rose-100 flex items-center justify-between">
                        <div className="flex items-center gap-3"><div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Beef size={20} /></div><span className="font-bold text-rose-800">Non-Veg</span></div>
                        <div className="text-right"><p className="text-xl font-black text-rose-700">₹{mahal.non_veg_price}</p><p className="text-[8px] uppercase text-rose-400 font-bold">Per Plate</p></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Facilities Section */}
              <div className="space-y-6">
                <h3 className="text-rose-900 font-serif text-2xl font-bold">Facilities & Amenities</h3>
                {editMode ? (
                  <textarea 
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="e.g. Centralized A/C, Valet Parking, Power Backup"
                    className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl h-32 focus:border-rose-400 outline-none text-sm"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mahal.amenities ? mahal.amenities.split(',').map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-rose-200 transition-colors">
                        <span className="text-2xl">{getIcon(item)}</span>
                        <span className="text-sm font-medium text-gray-700">{item.trim()}</span>
                      </div>
                    )) : (
                      <p className="text-gray-400 italic col-span-2">No facilities listed.</p>
                    )}
                  </div>
                )}
              </div>

              {editMode && (
                <button onClick={handleSave} className="w-full bg-rose-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2">
                  <Save size={20} /> Update Brochure
                </button>
              )}

              {!isOwner && (
                <div className="pt-10 border-t border-gray-100">
                  <Link to={`/book/${id}`}>
                    <button className="w-full bg-rose-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-[0_20px_40px_rgba(159,18,57,0.3)]">
                      Proceed to Booking
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brochure;
