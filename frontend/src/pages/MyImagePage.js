// frontend/src/pages/MyImagesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonCard from "../components/SkeletonCard";
import ImageCard from "../components/ImageCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const MyImagesPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // --- NEW: State for search query ---

  const fetchUserImages = async () => {
    setLoading(true);
    setError("");
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get("/api/images", config);
      setImages(data);
    } catch (err) {
      setError("Could not fetch your images.");
    }
    setLoading(false);
  };

  const listImageHandler = async (imageId, price) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/marketplace/${imageId}/list`, { price }, config);
      fetchUserImages(); // Refresh list to show updated status
    } catch (err) {
      alert(err.response?.data?.message || "Could not list image for sale.");
    }
  };

  // --- NEW: Handler for deleting an image ---
  const deleteImageHandler = async (imageId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/images/${imageId}`, config);
      fetchUserImages(); // Refresh the list after deletion
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the image.");
    }
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  // --- NEW: Filter images based on the search query ---
  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.overallCategories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          My Image Collection
        </h1>
      </div>

      {/* --- NEW: Search Input --- */}
      <div className="mb-12 max-w-xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : error ? (
          <p className="col-span-full text-center text-red-500 mt-8">{error}</p>
        ) : filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              isMarketplace={false}
              onList={listImageHandler}
              onDelete={deleteImageHandler} // Pass the delete handler
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            You haven't uploaded any images yet, or no images match your search.
          </p>
        )}
      </div>
    </div>
  );
};
export default MyImagesPage;
