const express = require("express");
const routerC = express.Router();
const {
  searchMarketplace,
  listImageForSale,
  buyImage,
} = require("../controllers/marketplaceController");
// --- IMPORT THE deleteImage CONTROLLER ---
const { deleteImage } = require("../controllers/imageController");
const { protect: protectMarket } = require("../middleware/authMiddleware");

routerC.get("/search", searchMarketplace);
routerC.put("/:imageId/list", protectMarket, listImageForSale);
routerC.post("/:imageId/buy", protectMarket, buyImage);

// --- NEW ROUTE FOR DELETING AN IMAGE FROM THE MARKETPLACE ---
// We reuse the existing deleteImage controller which already handles ownership checks.
routerC.delete("/:id", protectMarket, deleteImage);

module.exports = routerC;
