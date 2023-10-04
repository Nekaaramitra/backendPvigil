const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const bcrypt = require("bcryptjs");
const { generateToken, hashToken } = require("../utils/utils");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");

const cryptr = new Cryptr("process.env.CRYPTR_KEY");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill in all the Requires fields.");
  }

  //   Check if user exists
  const userExits = await User.findOne({ email });

  if (userExits) {
    res.status(400);
    throw new Error("Email already in use");
  }
  // Get Useragent
  // this
  // const ua = parser(req.headers["user-agent"]);
  // const userAgent = [ua.ua];

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, phone, photo } = user;

    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

// Login USer
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    throw new Error("please Add Email And Password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not Found, Please SignUp");
  }
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid Email or Password");
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

    const { _id, name, email, phone, photo } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      photo,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Something Went Wrong, Please Try Again");
    // res.status(500).json({ message: error.message });
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), //
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logout Successfull" });
});

// Get Users
const getUsers = asyncHandler(async (req, res) => {
  // console.log("get user hitted in the user controller");
  try {
    const users = await User.find().sort("-cretaedAt").select("-password");
    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, phone, photo } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      photo,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// Update User
// const updateUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     const { name, email, phone, photo } = user;

//     user.email = email;
//     user.name = req.body.name || name;
//     user.phone = req.body.phone || phone;
//     user.photo = req.body.photo || photo;

//     // const updateUser = await user.save();
//     await user.save();

//     res.status(200).json(user);
//     // res.status(200).json({
//     //   _id: updateUser._id,
//     //   name: updateUser.name,
//     //   email: updateUser.email,
//     //   phone: updateUser.phone,
//     //   photo: updateUser.photo,
//     // });
//   } else {
//     res.status(404);
//     throw new Error("User not Found");
//   }
// });

const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { name, phone, photo } = user;

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

const loginStatus = asyncHandler(async (req, res) => {
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
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  loginStatus,
  getUsers,
};
