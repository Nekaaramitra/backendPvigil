const express = require("express");
const router = express.Router();

const {
  registerRaid,
  getAllRaids,
  getRaidData,
  getRaids,
  // Add other raid controllers here...
} = require("../controllers/raidController");
const { officialProtect } = require("../middlewares/authMiddleware");

// Register a new raid
router.post("/registerRaid", officialProtect, registerRaid);
router.get("/getRaids", officialProtect, getRaids);
// Get all raids
router.get("/getAllRaids", getAllRaids);

// Get raid data by ID
router.get("/getRaidData/:id", getRaidData);

// Add more raid routes as needed...

module.exports = router;
