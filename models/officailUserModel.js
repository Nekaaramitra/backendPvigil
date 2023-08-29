const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const officialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a Name"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "Please add a User Id"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    // wardNo: {
    //   type: [String], // Array of strings to store multiple ward numbers
    //   required: [true, "Please add at least one Ward number"],
    //   trim: true,
    // },
    wardNo: {
      type: [String], // Store ward numbers as an array of strings
      required: [true, "Please add at least one Ward number"],
      validate: {
        validator: function (values) {
          // Check if each value in the array is a valid number
          // return values.every((value) => /^\d+$/.test(value));
          return values.every((value) => /^\d+$/.test(value));
        },
        message: "Please enter valid ward numbers",
      },
      unique: [true, "Ward Number is already Given"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please add a Password"],
    },
    phone: {
      type: String,
      trim: true,
      default: "+91",
    },
    photo: {
      type: String,
      requires: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    role: {
      type: String,
      trim: true,
      //   required: true,
      //   default: "subscriber",
    },
    assignedComplaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],
    raids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Raids",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

officialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const OfficialUser = mongoose.model("OfficialUser", officialSchema);
module.exports = OfficialUser;
