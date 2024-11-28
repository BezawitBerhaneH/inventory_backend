const purchaseRequestModel = require("../models/purchaseRequestModel");

const purchaseRequestController = {
  // Get all purchase requests
  getAllRequests: (req, res) => {
    purchaseRequestModel.getAllRequests((err, results) => {
      if (err) {
        console.error("Error fetching purchase requests:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ purchaseRequests: results });
    });
  },

  // Approve a purchase request
  approveRequest: (req, res) => {
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
  },

  // Decline a purchase request
  declineRequest: (req, res) => {
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
  }
};

module.exports = purchaseRequestController;
