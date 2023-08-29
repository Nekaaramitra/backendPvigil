const mongoose = require("mongoose");

const ComplaintSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "user",
    },
    user_email: {
      type: mongoose.Schema.Types.String,
      required: true,
      ref: "user_email",
    },
    complaint_status: {
      type: String,
      required: true,
      default: "Not Assigned",
    },
    descriptionByAdmin: {
      type: String,
      trim: true,
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
      type: Object,
      trim: true,
    },
    ward_no: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      trim: true,
    },
    videoURL: {
      type: String,
      trim: true,
    },
    glink: {
      type: String,
      required: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfficialUser", // Reference to the "OfficialUser" model (sub-admin)
    },
    raid: {
      type: Object,
      trim: true,
      raiderId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: "raiderId",
      },
      RimageURL: {
        type: String,
        trim: true,
      },
      RvideoURL: {
        type: String,
        trim: true,
      },

      descriptionByHI: {
        type: String,
        trim: true,
      },

      nuisance_creator: {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        firm_name: {
          type: String,
          trim: true,
          required: true,
        },
        action_Initiated: {
          type: String,
          trim: true,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
        },
        gstin: {
          type: String,
          required: true,
          trim: true,
        },
        trade_No: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        amount: {
          type: Number,
          trim: true,
        },
        receiptImageURL: {
          type: String,
          trim: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// const Complaint = mongoose.model("complaint", ComplaintSchema);

// module.exports = Complaint;

const Complaint = mongoose.model("Complaint", ComplaintSchema);

module.exports = Complaint;
