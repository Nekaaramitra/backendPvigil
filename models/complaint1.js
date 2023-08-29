const mongoose = require("mongoose");

const ComplaintSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "user",
    },
    complaint_status: {
      type: String,
      required: true,
      default: "pending",
    },
    complaint_info: {
      type: String,
      // required: true,
      default: "",
    },
    complaint_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      // type: String,
      type: Object,
      // required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      // required: true,
      trim: true,
    },
    videoURL: {
      type: String,
      // required: true,
      trim: true,
    },
    glink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("complaint", ComplaintSchema);

module.exports = Complaint;

// {

//     let userRef;

//     if (user) {
//          userRef = req.user._id;
//     } else {
//         userRef = anonymousUser
//     }
// }
