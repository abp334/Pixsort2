const Image = require("../models/Image");
const Order = require("../models/Order");
const cloudinary = require("cloudinary").v2;
const FormData = require("form-data");
const http = require("http");

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
    formData.append("image", req.file.buffer, req.file.originalname);

    const pythonApiResponse = await new Promise((resolve, reject) => {
      const url = new URL(process.env.PYTHON_API_URL);
      const request = formData.submit(
        {
          host: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "POST",
        },
        (err, response) => {
          if (err) return reject(err);
          let responseBody = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => {
            responseBody += chunk;
          });
          response.on("end", () => {
            try {
              const parsedBody = JSON.parse(responseBody);
              if (response.statusCode < 200 || response.statusCode >= 300) {
                reject({
                  response: { data: parsedBody, status: response.statusCode },
                });
              } else {
                resolve(parsedBody);
              }
            } catch (e) {
              reject(
                new Error(
                  `Failed to parse Python service response: ${responseBody}`
                )
              );
            }
          });
        }
      );
      request.on("error", (err) => reject(err));
    });

    const { detailed_categories, overall_categories } = pythonApiResponse;

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
