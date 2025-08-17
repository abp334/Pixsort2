const express = require("express");
const routerB = express.Router();
const {
  uploadImage,
  getUserImages,
  deleteImage, // Import the new delete function
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");

// Routes for getting images and uploading a new one
routerB.route("/").post(uploadImage).get(getUserImages);

// --- NEW ROUTE FOR DELETING AN IMAGE ---
routerB.route("/:id").delete(deleteImage);

module.exports = routerB;
