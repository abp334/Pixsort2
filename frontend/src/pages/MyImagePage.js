// frontend/src/pages/MyImagesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import SkeletonCard from "../components/SkeletonCard";
import ImageCard from "../components/ImageCard";
const MyImagesPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchUserImages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center">
        My Image Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : error ? (
          <p className="col-span-full text-center text-red-500 mt-8">{error}</p>
        ) : images.length > 0 ? (
          images.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              isMarketplace={false}
              onList={listImageHandler}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            You haven't uploaded any images yet.
          </p>
        )}
      </div>
    </div>
  );
};
export default MyImagesPage;
