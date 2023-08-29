const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // Assuming you have already configured Cloudinary

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Cloudinary configuration with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  //   secure: false,
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// HAsh TOken
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

module.exports = {
  generateToken,
  hashToken,
};
