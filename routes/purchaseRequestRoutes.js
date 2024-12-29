const express = require("express");
const purchaseRequestController = require("../controllers/purchaseRequestController");
const router = express.Router();

// Get all purchase requests
router.get("/requests", purchaseRequestController.getAllRequests);

// Approve a purchase request
router.put("/approve", purchaseRequestController.approveRequest);

// Decline a purchase request
router.put("/decline", purchaseRequestController.declineRequest);
router.post('/purchase-request', purchaseRequestController.createRequest);
// Route to get all pending purchase requests and count them
router.get('/pendingRequests', purchaseRequestController.getPendingRequests);
// Route for fetching purchase requests by the current department user
router.get("/department", purchaseRequestController.getRequestsByDepartment);
module.exports = router;
