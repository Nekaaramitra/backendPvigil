const asyncHandler = require("express-async-handler");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../utils/CloudinaryHelper");

const uploadImage = asyncHandler(async (req, res) => {
  const folderName = req.query.folderName;
  // console.log("Folder name in controller", folderName);

  // Assuming you're using multer to handle file uploads
  const imageBuffer = req.file.buffer; // Use req.file.buffer to access the uploaded image buffer

  try {
    // Save the image buffer to a temporary file
    const tempFilePath = path.join(__dirname, "temp_image.jpg"); // Replace with your preferred temporary file path and name
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Upload the temporary image file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: folderName,
      resource_type: "image",
      //   width: 500,
      //   height: 500,
      crop: "fill",
    });

    // Delete the temporary image file
    fs.unlinkSync(tempFilePath);

    // console.log("result in image Cloudinary", result);

    return res.status(201).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Image upload failed:", error);
    return res.status(500).json({ error: "Image upload failed" });
  }
});

const uploadVideo = asyncHandler(async (req, res) => {
  const folderName = req.query.folderName;
  // console.log("Folder name in controller", folderName);

  // Assuming you're using multer to handle file uploads
  const videoBuffer = req.file.buffer; // Use req.file.buffer to access the uploaded video buffer

  try {
    // Save the video buffer to a temporary file
    const tempFilePath = path.join(__dirname, "temp_video.mp4"); // Replace with your preferred temporary file path and name
    fs.writeFileSync(tempFilePath, videoBuffer);

    // Upload the temporary video file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: folderName,
      resource_type: "video",
    });

    // Delete the temporary video file
    fs.unlinkSync(tempFilePath);

    // console.log("result in video Cloudinary", result);

    return res.status(201).json({ videoUrl: result.secure_url });
  } catch (error) {
    console.error("Video upload failed:", error);
    return res.status(500).json({ error: "Video upload failed" });
  }
});

// module.exports = uploadMedia; // Export the controller function

module.exports = {
  //   uploadMedia,
  uploadImage,
  uploadVideo,
};
