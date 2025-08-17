const express = require("express");
const routerB = express.Router();
const {
  uploadImage,
  getUserImages,
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");
routerB.route("/").post(protect, uploadImage).get(protect, getUserImages);
module.exports = routerB;
