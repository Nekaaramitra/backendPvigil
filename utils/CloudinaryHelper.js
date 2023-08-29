const cloudinary = require("cloudinary").v2;

// Initialize Cloudinary configuration with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   //   secure: false,
// });

cloudinary.config({
  cloud_name: "pivigil",
  api_key: "288126832899263",
  api_secret: "vmBDTV1gUZmEPEz6Z6HXJ5WlYGI",
});

// cloudinary.config();

module.exports = { cloudinary };
