const mongoose = require("mongoose");

const RaidSchema = mongoose.Schema(
  {
    raidBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "OfficialUser",
    },
    raid_id: {
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
    action_Initiated: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    nuisance_creator: {
      name: {
        type: String,
        trim: true,
      },
      firm_name: {
        type: String,
        trim: true,
      },
      gstin: {
        type: String,
        trim: true,
      },
      trade_No: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
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
  {
    timestamps: true,
  }
);

const Raid = mongoose.model("Raid", RaidSchema);

module.exports = Raid;
