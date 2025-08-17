// backend/controllers/marketplaceController.js
const Image = require("../models/Image");
const Order = require("../models/Order");

exports.searchMarketplace = async (req, res) => {
  const { query } = req.query;
  try {
    const searchCriteria = { forSale: true };
    if (query) {
      searchCriteria.$text = { $search: query };
    }
    const images = await Image.find(searchCriteria)
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.listImageForSale = async (req, res) => {
  const { imageId } = req.params;
  const { price } = req.body;
  if (!price || price <= 0) {
    return res.status(400).json({ message: "Please provide a valid price." });
  }
  try {
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });
    if (image.user.toString() !== req.user.id)
      return res
        .status(401)
        .json({ message: "Not authorized to list this image" });
    image.forSale = true;
    image.price = price;
    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.buyImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    const image = await Image.findById(imageId);
    if (!image || !image.forSale)
      return res.status(404).json({ message: "Image not available for sale" });
    if (image.user.toString() === req.user.id)
      return res.status(400).json({ message: "You cannot buy your own image" });

    const order = new Order({
      buyer: req.user.id,
      seller: image.user,
      image: image._id,
      price: image.price,
    });
    await order.save();

    image.forSale = false;
    await image.save();

    res.json({
      message: "Purchase successful! This is a mock transaction.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
