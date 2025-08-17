const express = require("express");
const routerC = express.Router();
const {
  searchMarketplace,
  listImageForSale,
  buyImage,
} = require("../controllers/marketplaceController");
const { protect: protectMarket } = require("../middleware/authMiddleware");
routerC.get("/search", searchMarketplace);
routerC.put("/:imageId/list", protectMarket, listImageForSale);
routerC.post("/:imageId/buy", protectMarket, buyImage);
module.exports = routerC;
