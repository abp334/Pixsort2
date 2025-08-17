const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const marketplaceRoutes = require("./routes/marketplace");
const { protect } = require("./middleware/authMiddleware");

dotenv.config({ path: __dirname + "/.env" });
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));
mongoose.set("strictQuery", true);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/api/auth", authRoutes);

// --- FINAL FIX: Ensure multer looks for the 'image' field ---
app.use("/api/images", protect, upload.single("image"), imageRoutes);

app.use("/api/marketplace", marketplaceRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
