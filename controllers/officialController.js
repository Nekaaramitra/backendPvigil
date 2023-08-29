const asyncHandler = require("express-async-handler");
const OfficialUser = require("../models/officailUserModel");
const Complaint = require("../models/ComplaintModel");
const Token = require("../models/tokenModel");
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils/utils");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");

const cryptr = new Cryptr("process.env.CRYPTR_KEY");

const registerOfficialUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone, role, userId, wardNo } = req.body;

    // console.log("WARDNO in the controller register User", wardNo);

    // Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all the required fields.");
    }

    // Check if user exists
    const userExists = await OfficialUser.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Email already in use");
    }

    // Check if any user has the same wardNo
    const wardNoExists = await OfficialUser.findOne({
      wardNo: { $in: wardNo },
    });

    if (wardNoExists) {
      res.status(400);
      throw new Error("Ward number already in use");
    }

    const user = await OfficialUser.create({
      name,
      email,
      password,
      phone,
      role,
      userId,
      wardNo,
    });

    if (user) {
      const { _id, name, email, phone, role, userId, wardNo } = user;

      res.status(201).json({
        _id,
        name,
        email,
        phone,
        role,
        userId,
        wardNo,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(500);
    console.error(
      "erron in the Register Official USer Controller",
      error.message
    );
    throw new Error(`Error ${error.message}`);
  }
});

// Login USer
const loginOfficialUser = asyncHandler(async (req, res) => {
  const { emailOrUserId, password } = req.body;
  // console.log("req body in the login official auth", req.body);

  // Validation
  if (!emailOrUserId || !password) {
    throw new Error("Please provide both Email/User ID and Password");
  }

  // Find the user by either email or user_id
  const user = await OfficialUser.findOne({
    $or: [{ email: emailOrUserId }, { userId: emailOrUserId }],
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found. Please Sign Up");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid Email/User ID or Password");
  }

  // generateToken
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    // send Http only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: true,
    });

    const {
      _id,
      name,
      email,
      phone,
      photo,
      raids,
      role,
      wardNo,
      userId,
      assignedComplaints,
    } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      photo,
      raids,
      role,
      wardNo,
      userId,
      assignedComplaints,
      token,
    });
    // res.status(200).json({
    //   user,
    //   token,
    // });
  } else {
    res.status(500);
    throw new Error("Something Went Wrong, Please Try Again");
  }
});
// console.log("login from official user from backend", loginOfficialUser);

// Logout User
const logoutOfficialUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logout Successfull" });
});

// Get Official Users
const getOfficialUsers = asyncHandler(async (req, res) => {
  try {
    const users = await OfficialUser.find()
      .populate("assignedComplaints", "complaint_id")
      .sort("-createdAt")
      .select("-password");
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No official users found" });
    }
  } catch (error) {
    console.error("error in getUsers", error);
    res.status(500).json({ message: error.message });
  }
});

// Get User
const getOfficialUser = asyncHandler(async (req, res) => {
  const user = await OfficialUser.findById(req.user._id).populate({
    path: "assignedComplaints",
    select: "complaint_id raid.nuisance_creator.action_Initiated",
    options: { sort: { createdAt: -1, updatedAt: -1 } }, // Sort the populated array
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// Update User
const updateOfficialUser = asyncHandler(async (req, res) => {
  try {
    const user = await OfficialUser.findById(req.user._id);
    // console.log("User in updateOfficialUser Controller", user);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { name, email, phone, photo } = user;

    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    // Handle the error
    res.status(500).json({ error: error.message });
  }
});

const officialLoginStatus = asyncHandler(async (req, res) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.json(false);
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.json(false);
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    // Handle token verification error
    console.log("error in backedn at loginStatus", error.message);
    return res.json(false);
  }
});

module.exports = {
  registerOfficialUser,
  loginOfficialUser,
  logoutOfficialUser,
  getOfficialUser,
  updateOfficialUser,
  officialLoginStatus,
  getOfficialUsers,
};
