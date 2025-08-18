import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateMahal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
    description: "",
    image: null
  });

  const [preview, setPreview] = useState(null);

  // Fetch existing mahal data
  useEffect(() => {
    axios
      .get(`https://hallify.onrender.com/api/mahal/get/${id}`)
      .then((res) => {
        const { name, location, capacity, price, description, image_url } = res.data;
        setFormData({ name, location, capacity, price, description, image: null });
        setPreview(`https://hallify.onrender.com/uploads/${image_url}`);
      })
      .catch((err) => console.error("Error fetching mahal:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("capacity", formData.capacity);
    data.append("price", formData.price);
    data.append("contact", formData.contact);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.put(`https://hallify.onrender.com/api/mahal/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Mahal updated successfully!");
      navigate(`/mahal/${id}`);
    } catch (err) {
      console.error("Error updating mahal:", err);
      alert("Failed to update mahal");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Update Mahal</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact</label>
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            pattern="[0-9]{10}" // Validates for 10-digit number
            className="w-full border rounded-lg px-4 py-2"
            onChange={handleChange}
            required
          />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Image</label>
            <input type="file" onChange={handleFileChange} className="w-full" />
            {preview && <img src={preview} alt="Preview" className="mt-4 rounded-lg h-40 object-cover" />}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Update Mahal
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMahal;
