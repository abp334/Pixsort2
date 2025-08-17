// backend/models/Image.js
const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    detailedCategories: [{ type: String }],
    overallCategories: [{ type: String }],
    forSale: { type: Boolean, default: false },
    price: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);
imageSchema.index({
  title: "text",
  detailedCategories: "text",
  overallCategories: "text",
});
module.exports = mongoose.model("Image", imageSchema);
