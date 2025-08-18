import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MahalDetails = () => {
  const { id } = useParams();
  const [mahal, setMahal] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // { id, role }

  useEffect(() => {
    axios
      .get(`https://hallify.onrender.com/api/mahal/get/${id}`)
      .then((res) => setMahal(res.data))
      .catch((err) => console.error("❌ Error fetching mahal:", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://hallify.onrender.com/api/mahal/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Mahal deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting mahal:", err);
      alert("Failed to delete mahal");
    }
  };

  if (!mahal) return <div className="text-center pt-24 text-xl">Loading...</div>;

  const canEdit = user?.role === "admin";
  const canDelete =
    user?.role === "admin" || (user?.role === "owner" && user?.id === mahal.owner_id);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-96">
        <img
          src={`https://hallify.onrender.com/uploads/${mahal.image_url}`}
          alt={mahal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">{mahal.name}</h1>
          <p className="text-lg mt-3">{mahal.location}</p>
        </div>
        <Link to="/" className="absolute top-6 left-6">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100">
            Back
          </button>
        </Link>
      </div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 -mt-16 relative z-10">
          {/* Price & Capacity */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-2xl font-bold text-indigo-500">₹{mahal.price}</div>
            <div className="flex flex-row lg:flex-col gap-4 text-gray-700 font-medium px-2">
  <span>👥 Capacity: {mahal.capacity}</span>
  <span>📞 Contact: {mahal.contact}</span>
</div>


          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">{mahal.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-indigo-300 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg hover:from-indigo-500 hover:to-indigo-300 transition">
              Book Now
            </button>

            {canEdit && (
              <Link to={`/update/${id}`}>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition">
                  Edit
                </button>
              </Link>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 shadow-lg transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MahalDetails;
