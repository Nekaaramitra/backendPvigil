const express = require("express");
const router = express.Router();
const { protect, officialProtect } = require("../middlewares/authMiddleware"); // MiddleWare
const {
  registerComplaint,
  searchComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaints,
  getComplaintData,
  AnonymousComplaint,
  updateComplaintBySuperAdmin,

  updateComplaintByOfficials,
} = require("../controllers/complaintsController");

router.post("/anonymousComplaint", AnonymousComplaint);
router.get("/getAllComplaints", getAllComplaints);
router.post("/registerComplaint", protect, registerComplaint);

router.get("/getComplaintData/:id", getComplaintData);
router.get("/getComplaints", protect, getComplaints);
router.get("/getComplaintById", protect, getComplaintById);

router.get("/searchComplaint/:complaint_id", searchComplaint);
router.patch("/updateComplaintBySuperAdmin", updateComplaintBySuperAdmin);
router.patch(
  "/updateComplaintByOfficials",
  officialProtect,
  updateComplaintByOfficials
);
module.exports = router;
