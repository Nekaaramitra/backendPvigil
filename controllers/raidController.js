const asyncHandler = require("express-async-handler");
const Raid = require("../models/RaidModel"); // Adjust the path accordingly

// Controller function to create a new Raid document
const registerRaid = asyncHandler(async (req, res) => {
  try {
    // Destructure data from the request body
    // Get the raider ID from req.user
    const raiderId = req.user._id; // Assuming the user ID is stored in _id field

    const {
      landmark,
      description,
      location,
      ward_no,
      imageURL,
      videoURL,
      glink,
      action_Initiated,
      nuisance_creator,
      amount,
      receiptImageURL,
      reason,
    } = req.body;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Create a new Date object
    const currentDate = new Date();

    // Get the year, month, and day components
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to the month since it is zero-based
    const day = currentDate.getDate().toString().padStart(2, "0");

    // Format the date as "YYMMDD"
    const formattedDate = year + month + day;

    let TotalRaids =
      (await Raid.find({ createdAt: { $gt: today } }).countDocuments()) + 1;

    let numbertoString = TotalRaids.toString();

    if (numbertoString.length < 4) {
      for (let i = numbertoString.length; i < 4; i++) {
        numbertoString = "0" + numbertoString;
      }
    }
    let raid_id = formattedDate + "R" + numbertoString;

    // Create a new Raid document
    const newRaid = new Raid({
      raidBy: raiderId,
      raid_id,
      landmark,
      description,
      location,
      ward_no,
      imageURL,
      videoURL,
      glink,
      action_Initiated,
      nuisance_creator,
      amount,
      receiptImageURL,
      reason,
    });

    // Save the new Raid document
    await newRaid.save();

    res
      .status(201)
      .json({ success: true, message: "Raid created successfully" });

    // console.log("rs in the controller of registered Raid", newRaid);
  } catch (error) {
    console.error("Error creating Raid:", error);
    res.status(500).json({ success: false, message: "Raid creation failed" });
  }
});

const getRaids = asyncHandler(async (req, res) => {
  try {
    const raids = await Raid.find({ raidBy: req.user._id }).sort({
      createdAt: -1,
      updatedAt: -1,
    });
    res.status(200).json(raids);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const getAllRaids = asyncHandler(async (req, res) => {
  try {
    // console.log("getAllRaids hitted in the cntroller");
    const raids = await Raid.find()
      .populate("raidBy", "name email userId") // Adjust the field names based on your schema
      .sort({ createdAt: -1, updatedAt: -1 });

    res.status(200).json(raids);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in the getAllRaids controller", error.message);
  }
});

const getRaidData = asyncHandler(async (req, res) => {
  try {
    const raid = await Raid.findById(req.params.id).populate(
      "raidBy",
      "userId"
    );
    if (raid) {
      res.status(200).json(raid);
    } else {
      res.status(404).json({ message: "Raid Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getRaidData:", error.message);
  }
});

module.exports = {
  registerRaid,
  getRaids,
  getAllRaids,
  getRaidData,
};
