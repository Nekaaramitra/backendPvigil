const express = require("express");
const router = express.Router();

const { officialProtect } = require("../middlewares/authMiddleware");
const {
  registerOfficialUser,
  loginOfficialUser,
  getOfficialUser,
  getOfficialUsers,
  updateOfficialUser,
  logoutOfficialUser,
  officialLoginStatus,
} = require("../controllers/officialController");

router.post("/registerOfficialUser", registerOfficialUser);
router.post("/loginOfficialUser", loginOfficialUser);
router.get("/logoutOfficialUser", logoutOfficialUser);
router.get("/getOfficialUser", officialProtect, getOfficialUser);
router.get("/getOfficialUsers", getOfficialUsers);
router.patch("/updateOfficialUser", officialProtect, updateOfficialUser);

// router.get("/loginStatus", loginStatus);
router.get("/officialLoginStatus", officialLoginStatus);

module.exports = router;
