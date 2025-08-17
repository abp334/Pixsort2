// frontend/src/pages/MarketplacePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonCard from "../components/SkeletonCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ImageCard from "../components/ImageCard";
const MarketplacePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchMarketplaceImages = async (searchQuery = "") => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `/api/marketplace/search?query=${searchQuery}`
      );
      setImages(data);
    } catch (err) {
      setError("Could not fetch marketplace images.");
    }
    setLoading(false);
  };

  const buyImageHandler = async (imageId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        `/api/marketplace/${imageId}/buy`,
        {},
        config
      );
      alert(data.message);
      fetchMarketplaceImages(query); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed.");
    }
  };

  useEffect(() => {
    fetchMarketplaceImages();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMarketplaceImages(query);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Marketplace</h1>
        <p className="mt-2 text-lg text-gray-600">
          Discover and purchase unique AI-categorized images.
        </p>
      </div>
      <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by category, e.g., 'food' or 'nature'"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : error ? (
          <p className="col-span-full text-center text-red-500 mt-8">{error}</p>
        ) : images.length > 0 ? (
          images.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              isMarketplace={true}
              onBuy={buyImageHandler}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No images found for sale.
          </p>
        )}
      </div>
    </div>
  );
};
export default MarketplacePage;
