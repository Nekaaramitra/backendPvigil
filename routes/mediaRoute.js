const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage, uploadVideo } = require("../controllers/mediaController");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type!"), false);
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post("/uploadImage", uploads.single("image"), uploadImage);
router.post("/uploadVideo", uploads.single("video"), uploadVideo);

module.exports = router;
