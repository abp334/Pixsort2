import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Spinner from "../components/Spinner";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    } else {
      setImage(null);
      setPreview("");
      setError("Please select a valid image file.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image || !title) {
      setError("Please provide a title and an image.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    // --- FINAL FIX: Use the 'image' field to match the entire system ---
    formData.append("image", image);
    formData.append("title", title);

    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post("/api/images", formData, config);
      navigate("/my-images");
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Upload New Image
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Image Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Sunset over the mountains"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-48 w-auto rounded-md"
                  />
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? (
                <Spinner small />
              ) : (
                <>
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" /> Upload & Classify
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
