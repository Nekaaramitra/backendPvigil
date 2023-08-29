const asyncHandler = require("express-async-handler");
const Complaint = require("../models/ComplaintModel");
const OfficialUser = require("../models/officailUserModel");

// Register Complaint
const registerComplaint = asyncHandler(async (req, res) => {
  let complaint = req.body;
  const userId = req.user._id.toString();

  try {
    if (!complaint.landmark || !complaint.description || !complaint.glink) {
      res.status(404);
      throw new Error("All fields are Required");
    } else {
      // Uploading image to Cloudinary

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

      let TotalComplaints =
        (await Complaint.find({ createdAt: { $gt: today } }).countDocuments()) +
        1;

      let numbertoString = TotalComplaints.toString();

      if (numbertoString.length < 4) {
        for (let i = numbertoString.length; i < 4; i++) {
          numbertoString = "0" + numbertoString;
        }
      }
      // for Complaint Id
      let complaintId;
      complaintId = formattedDate + "C" + numbertoString;

      const mycomplaint = new Complaint({
        // user: "Annonymous",
        user: userId,
        user_email: req.user.email,
        complaint_id: complaintId,

        ...complaint,
      });

      const createdcomplaint = await mycomplaint.save();
      res.status(201).json(createdcomplaint);

      // console.log("created Complaint", createdcomplaint);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error message in Register Complaint", error.message);
  }
});

const AnonymousComplaint = asyncHandler(async (req, res) => {
  let complaint = req.body;

  // console.log("Anonymous Complaint Hitted");

  try {
    if (
      // !complaint.complaint_id ||
      // !complaint.complaint_status ||
      !complaint.landmark ||
      !complaint.description ||
      !complaint.glink
    ) {
      res.status(404);
      throw new Error("All fields are required");
    } else {
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

      let TotalComplaints =
        (await Complaint.find({ createdAt: { $gt: today } }).countDocuments()) +
        1;

      let numbertoString = TotalComplaints.toString();

      if (numbertoString.length < 4) {
        for (let i = numbertoString.length; i < 4; i++) {
          numbertoString = "0" + numbertoString;
        }
      }
      // let formattedValue = formattedDate
      // for Complaint Id
      let complaintId;
      complaintId = formattedDate + "C" + numbertoString;

      // console.log("Annoymous Complaint hitted Again");

      const mycomplaint = new Complaint({
        user: `Anonymous${complaintId}`,
        user_email: `Anonymous${complaintId}`,
        complaint_id: complaintId,
        ...complaint,
      });

      const createdcomplaint = await mycomplaint.save();
      res.status(201).json(createdcomplaint);

      // console.log("created Complaint", createdcomplaint);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error message in Anonymous Complaint", error.message);
  }
});

// Fetch Single ROom
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  try {
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: "Complaint Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get SignedIn users Complaint
const getComplaints = asyncHandler(async (req, res) => {
  try {
    // console.log("Get Complaints Hitted");
    const complaints = await Complaint.find({ user: req.user._id }).sort({
      updatedAt: -1,
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// getAllComplaints
const getAllComplaints = asyncHandler(async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("assignedTo", "name email userId")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const searchComplaint = asyncHandler(async (req, res) => {
  try {
    // console.log("searched COmplain hitted");
    const { complaint_id: complaint_id } = req.params;
    const complaint = await Complaint.findOne({ complaint_id }).select({
      _id: 0,
      _v: 0,
    });
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: "Complaint Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Complaint Data for Admin
const getComplaintData = asyncHandler(async (req, res) => {
  // console.log("Complaint in the getComplaintData", req.params);
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "assignedTo",
      "userId"
    );
    if (complaint) {
      res.status(200).json(complaint);
    } else {
      res.status(404).json({ message: "Complaint NOt Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in the getCOmplaintData", error.message);
  }
});

const updateComplaintByOfficials = asyncHandler(async (req, res) => {
  // console.log("req. body in updateComplaintByOfficials", req.body);

  const {
    id,
    action_initiated,
    name,
    firm_name,
    gstin,
    trade_No,
    phone,
    penaltyAmount,
    RimageURL,
    RvideoURL,
    selectedReason,
    receiptImageURL,
    commentByHI,
  } = req.body;
  const { _id } = req.user;

  let raiderId = _id;

  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }
    if (!_id) {
      return res.status(404).json({ message: "Official User Not Found" });
    }

    // Initialize the raid object if it's not present
    if (!complaint.raid) {
      complaint.raid = {};
    }

    // Initialize the nuisance_creator object if it's not present
    if (!complaint.raid.nuisance_creator) {
      complaint.raid.nuisance_creator = {};
    }

    complaint.raid.raiderId = raiderId;
    complaint.raid.RimageURL = RimageURL;
    complaint.raid.RvideoURL = RvideoURL;
    complaint.raid.descriptionByHI = commentByHI;

    complaint.raid.nuisance_creator.name = name;
    complaint.raid.nuisance_creator.firm_name = firm_name;
    complaint.raid.nuisance_creator.action_Initiated = action_initiated;
    complaint.raid.nuisance_creator.reason = selectedReason;
    complaint.raid.nuisance_creator.penaltyAmount = penaltyAmount;
    complaint.raid.nuisance_creator.gstin = gstin;
    complaint.raid.nuisance_creator.trade_No = trade_No;
    complaint.raid.nuisance_creator.phone = phone;
    complaint.raid.nuisance_creator.receiptImageURL = receiptImageURL;

    await complaint.save();

    res.status(200).json({
      message: `Complaint Status Updated for ${complaint.raid.nuisance_creator.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(
      "error in the updateComplaintByOfficials controller",
      error.message
    );
  }
});

const updateComplaintBySuperAdmin = asyncHandler(async (req, res) => {
  const { complaint_status, id, assignedTo, comment } = req.body;
  const complaint = await Complaint.findById(id);
  // console.log("complaint in updateComplaintBySuperAdmin ", complaint);

  try {
    if (!complaint) {
      res.status(404);
      return res.json({ message: "Complaint this Not Found" });
    }

    // Update the complaint status
    complaint.complaint_status = complaint_status;
    complaint.descriptionByAdmin = comment;

    if (assignedTo) {
      // Update the assignedTo field
      complaint.assignedTo = assignedTo;

      // Find the sub-admin to whom the complaint is assigned
      const subAdmin = await OfficialUser.findById(assignedTo);

      if (subAdmin) {
        // You can trigger a notification here or add the complaint to the sub-admin's assigned complaints list
        // For example, you can push the complaint ID to the sub-admin's assignedComplaints array
        subAdmin.assignedComplaints.push(id);
        await subAdmin.save();
      }
    }

    await complaint.save();

    res.status(200).json(complaint);
    // console.log("complaint in res", complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  registerComplaint,
  getComplaintData,
  getAllComplaints,
  searchComplaint,
  getComplaintById,
  AnonymousComplaint,
  getComplaints,
  updateComplaintBySuperAdmin,
  updateComplaintByOfficials,
};
