const express = require("express");
const router = express.Router();
const { validateLocation } = require("../controllers/locationController");

router.post("/validate-location", (req, res) => {
  const { latitude, longitude } = req.body;

  // Validate the location within the city limits
  const { isInsideCityLimits, wardNo } = validateLocation(latitude, longitude);
  console.log("is within city limits in locationRoute", isInsideCityLimits);

  res.json({ isInsideCityLimits, wardNo }); // Send wardNo as part of the response
});

module.exports = router;
