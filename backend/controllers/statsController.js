// backend/controllers/statsController.js
const Image = require("../models/Image");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getStats = async (req, res) => {
  try {
    const imageCount = await Image.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();

    // This log will now work correctly on your backend terminal
    console.log("Backend Stats:", { imageCount, orderCount, userCount });

    res.json({
      imagesUploaded: imageCount,
      imagesTraded: orderCount,
      usersRegistered: userCount,
    });
  } catch (error) {
    // This catch block was likely being triggered before
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
