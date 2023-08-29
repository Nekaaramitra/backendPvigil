const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const OfficialUser = require("../models/officailUserModel");

// const protect = asyncHandler(async (req, res, next) => {
//   try {
//     // console.log("Request cookies", req.cookies)
//     const thiscookie = req.headers;

//     console.log("Req Headers thisCookie", thiscookie);

//     // const token = req.headers.authorization.split(" ")[1];
//     // const token = req.cookies.token;
//     if (!token) {
//       res.status(401);
//       throw new Error("Not Authorized, PLease Login");
//     }

//     // verify Token
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     // Get user id from token
//     const user = await User.findById(verified.id).select("-password");

//     if (!user) {
//       res.status(404);
//       throw new Error("User Not Found");
//     }
//     if (user.role === "suspended") {
//       res.status(400);
//       throw new Error("User Suspended, Please Contact Support");
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: error.message });
//     console.log("protect Error", error.message);
//   }
// });

const officialProtect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    // console.log("token from backend in officialProtect", token);
    // console.log(
    //   "Req headers in the officialProtect",
    //   req.headers.authorization
    // );

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Get user id from token
    const user = await OfficialUser.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // if (user.role === "suspended") {
    //   res.status(400);
    //   throw new Error("User suspended, please contact support");
    // }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: `official Protect Error ${error.message}` });
    console.log("official protect Error", error.message);
  }
});

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    // console.log("token from backend", token);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Get user id from token
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // if (user.role === "suspended") {
    //   res.status(400);
    //   throw new Error("User suspended, please contact support");
    // }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log("protect Error", error.message);
  }
});

const verifiedOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, account not verified");
  }
});

const authorOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role === "author" || req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an author");
  }
});

const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

const reqUser = asyncHandler(async (req, res, next) => {
  // Check if the user is authenticated
  const user = await User.findById(verified.id).select("-password");
  console.log("user in Req user middleware", user);
  try {
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in the reqUser Middle ware", error);
  }

  // User is authenticated, proceed to the next middleware
});

module.exports = {
  reqUser,
  protect,
  verifiedOnly,
  authorOnly,
  adminOnly,
  officialProtect,
};
