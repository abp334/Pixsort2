const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const FormData = require("form-data");

cloudinary.config({
  cloud_name: "djejk5rje",
  api_key: "978639449887691",
  api_secret: "0HU23M4Ha8AvFGRctxGCu2FyByU",
});
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image file." });
  }

  try {
    const formData = new FormData();

    // --- FINAL FIX: Use the correct syntax for appending a Buffer ---
    // The 'form-data' library expects the filename as the third argument.
    // This was the root cause of the TypeError: source.on is not a function.
    formData.append("image", req.file.buffer, req.file.originalname);

    const pythonApiResponse = await axios.post(
      process.env.PYTHON_API_URL,
      formData,
      { headers: formData.getHeaders() }
    );

    const { detailed_categories, overall_categories } = pythonApiResponse.data;

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

exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
