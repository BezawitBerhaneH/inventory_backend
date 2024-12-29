const purchaseRequestModel = require("../models/purchaseRequestModel");


const { authMiddleware } = require("./LoginController");

const purchaseRequestController = {
  // Create a new purchase request (only for users of specific department)
  createRequest: [authMiddleware, (req, res) => {
    // Check if the user is from the allowed department
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
        console.error("Error creating request:", err.message);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      res.status(201).json({ message: "Purchase request created successfully" });
    });
  }],

  // Get all purchase requests (only for procurement officers)
  getAllRequests: [authMiddleware, (req, res) => {
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    purchaseRequestModel.getAllRequests((err, results) => {
      if (err) {
        console.error("Error fetching purchase requests:", err.message);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.status(200).json({ purchaseRequests: results });
    });
  }],
  getPendingRequests: [authMiddleware, (req, res) => {
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    purchaseRequestModel.getPendingRequests((err, results) => {
      if (err) {
        console.error("Error fetching pending requests:", err.message);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      const pendingCount = results.length;
      res.status(200).json({ pendingRequests: results, pendingCount });
    });
  }],

  approveRequest: [authMiddleware, async (req, res) => {
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { requestID, supplierID, note } = req.body;

    if (!requestID || !supplierID || !note) {
      return res.status(400).json({ message: "Request ID and Supplier ID are required" });
    }

    try {
      // Lazy load the supplier model
      const supplierModel = require("../models/supplier");

      // Verify supplier exists
      const supplier = await supplierModel.findOne({ where: { supplierID } });
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Approve the request and associate it with the supplier
      const [updatedRows] = await purchaseRequestModel.approveRequest(requestID, supplierID, note);

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Request not found or already approved" });
      }

      res.status(200).json({ message: "Request approved and associated with supplier successfully" });
    } catch (err) {
      console.error("Error approving request:", err.message);
      res.status(500).json({ message: "Database error", error: err.message });
    }
  }],




  

  // Decline a purchase request (only for procurement officers)
  declineRequest: [authMiddleware, (req, res) => {
    if (req.user.role !== "procurement officer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { requestID } = req.body;

    if (!requestID) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    purchaseRequestModel.declineRequest(requestID, (err, result) => {
      if (err) {
        console.error("Error declining request:", err.message);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.status(200).json({ message: "Request declined successfully" });
    });
  }],
    // Get purchase requests for a specific department (only for department users)
    getRequestsByDepartment: [authMiddleware, (req, res) => {
      if (req.user.role !== "department") {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      const userID = req.user.userID; // Extract the userID from the token
  
      purchaseRequestModel.getRequestsByUser(userID, (err, results) => {
        if (err) {
          console.error("Error fetching department requests:", err.message);
          return res.status(500).json({ message: "Database error", error: err.message });
        }
  
        res.status(200).json({ departmentRequests: results });
      });
    }],
  
};


module.exports = purchaseRequestController;
