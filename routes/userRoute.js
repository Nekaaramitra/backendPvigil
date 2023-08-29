const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  // changePassword,
  loginStatus,
  getUsers,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/getUsers", getUsers);
router.patch("/updateUser", protect, updateUser);

router.get("/loginStatus", loginStatus);

module.exports = router;
