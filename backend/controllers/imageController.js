// backend/controllers/imageController.js
const Image = require("../models/Image");
const Order = require("../models/Order");
const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const FormData = require("form-data");
const http = require("http");
const axios = require("axios");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image file." });
  }

  try {
    console.log(`[DEBUG] Backend received file: ${req.file.originalname}, Size: ${req.file.size} bytes, Mime: ${req.file.mimetype}`);
    
    if (!req.file.buffer || req.file.buffer.length === 0) {
      console.error("[ERROR] File buffer is empty!");
      return res.status(400).json({ message: "Uploaded file is empty." });
    }

    const formData = new FormData();
    formData.append("image", req.file.buffer, req.file.originalname);

    console.log(`[DEBUG] Env Vars - PYTHON_API_URL: ${process.env.PYTHON_API_URL || 'Not Set'}`);
    console.log(`[DEBUG] Env Vars - PYTHON_SERVICE_HOST: ${process.env.PYTHON_SERVICE_HOST || 'Not Set'}`);
    console.log(`[DEBUG] Env Vars - PYTHON_SERVICE_PORT: ${process.env.PYTHON_SERVICE_PORT || 'Not Set'}`);

    let pythonServiceUrl;
    if (process.env.PYTHON_API_URL) {
      pythonServiceUrl = process.env.PYTHON_API_URL;
    } else if (process.env.PYTHON_SERVICE_HOST && process.env.PYTHON_SERVICE_PORT) {
      // Default to http, but axios will follow redirect if needed (though 307 preserves method, axios might need config to follow POST)
      // Actually 307 requires re-sending body. Axios does this automatically for 307.
      // However, if we are internal, we usually talk http.
      // If Render forces HTTPS, we should start with https if port is 443.
      const protocol = process.env.PYTHON_SERVICE_PORT === '443' ? 'https' : 'http';
      pythonServiceUrl = `${protocol}://${process.env.PYTHON_SERVICE_HOST}:${process.env.PYTHON_SERVICE_PORT}/api/classify/`;
    } else {
      throw new Error("Missing Python Service connection configuration. Check if 'pixsort-marketplace' service is running.");
    }

    console.log(`[DEBUG] Python Service URL: ${pythonServiceUrl}`);

    const pythonResponse = await axios.post(pythonServiceUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: (status) => status < 500, // Handle 4xx gracefully
    });
    
    console.log(`[DEBUG] Python Service Response Status: ${pythonResponse.status}`);
    
    if (pythonResponse.status >= 300) {
       console.error(`[ERROR] Python Service returned error:`, pythonResponse.data);
       throw new Error(`Python service failed with status ${pythonResponse.status}`);
    }

    const { detailed_categories, overall_categories } = pythonResponse.data;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "image_marketplace" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const newImage = new Image({
      user: req.user.id,
      title: req.body.title || "Untitled",
      imageUrl: result.secure_url,
      publicId: result.public_id,
      detailedCategories: detailed_categories,
      overallCategories: overall_categories,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error("--- BACKEND UPLOAD ERROR ---");
    if (error.response) {
      console.error("Python Service Response Data:", error.response.data);
      console.error("Python Service Response Status:", error.response.status);
    } else {
      console.error("Full Error Object:", error);
    }
    res.status(500).json({
      message: "Server error during upload. Check backend logs for details.",
    });
  }
};

// --- MODIFIED AND CORRECTED getUserImages FUNCTION ---
exports.getUserImages = async (req, res) => {
  try {
    // 1. Get images uploaded by the user and populate the user's name
    const uploadedImages = await Image.find({ user: req.user.id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    // 2. Get images purchased by the user
    const purchasedOrders = await Order.find({ buyer: req.user.id }).populate({
      path: "image",
      populate: {
        path: "user",
        select: "username", // Populate the creator's username within the image
      },
    });

    const purchasedImages = purchasedOrders
      .map((order) => order.image)
      .filter(Boolean); // Filter out any null images

    // 3. Combine and ensure no duplicates, then sort
    const allImages = [...uploadedImages, ...purchasedImages];
    const uniqueImages = Array.from(
      new Map(allImages.map((item) => [item._id.toString(), item])).values()
    );
    uniqueImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(uniqueImages);
  } catch (error) {
    console.error("--- GET USER IMAGES ERROR ---", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    if (image.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await cloudinary.uploader.destroy(image.publicId);
    await image.remove();
    res.json({ message: "Image removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
