const purchaseRequestModel = require("../models/purchaseRequestModel");
const { authMiddleware } = require("./LoginController"); // Import the authentication middleware

const purchaseRequestController = {
  // Create a new purchase request (only for users of specific department)
  createRequest: [authMiddleware, (req, res) => { 
    // Check if the user is from the allowed department (assuming `req.user.department` holds the department)
    if (req.user.role !== "department") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { itemDetails, quantity, deliveryRequirements } = req.body;
    const requestedBy = req.user.userID; // Extract userID from the token

    if (!itemDetails || !quantity) {
      return res.status(400).json({ message: "Item details and quantity are required" });
    }

    purchaseRequestModel.createRequest(itemDetails, quantity, deliveryRequirements, requestedBy, (err) => {
      if (err) {
        console.error("Error creating request:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "Purchase request created successfully" });
    });
  }],

  // Get all purchase requests (only for procurement officers)
  getAllRequests: [authMiddleware, (req, res) => { 
    // Check if the user is a procurement officer
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    purchaseRequestModel.getAllRequests((err, results) => {
      if (err) {
        console.error("Error fetching purchase requests:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ purchaseRequests: results });
    });
  }],

  // Approve a purchase request (only for procurement officers)
  approveRequest: [authMiddleware, (req, res) => { 
    // Check if the user is a procurement officer
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { requestID } = req.body;

    if (!requestID) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    purchaseRequestModel.approveRequest(requestID, (err, result) => {
      if (err) {
        console.error("Error approving request:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.status(200).json({ message: "Request approved successfully" });
    });
  }],

  // Decline a purchase request (only for procurement officers)
  declineRequest: [authMiddleware, (req, res) => { 
    // Check if the user is a procurement officer
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { requestID } = req.body;

    if (!requestID) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    purchaseRequestModel.declineRequest(requestID, (err, result) => {
      if (err) {
        console.error("Error declining request:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.status(200).json({ message: "Request declined successfully" });
    });
  }]
};

module.exports = purchaseRequestController;
