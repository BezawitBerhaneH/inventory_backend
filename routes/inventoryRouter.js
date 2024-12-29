const express = require("express");
const InventoryController = require("../controllers/inventoryController");

const router = express.Router();

// Route to fetch all inventory items
router.get("/", InventoryController.getAll);

// Route to add a new inventory item
router.post("/add", InventoryController.add);

// Route to request an item from the inventory
router.post("/request", InventoryController.requestItem);

// Route to approve a specific request
router.post("/approve/:requestID", InventoryController.approveRequest);

// Route to update the threshold of an inventory item
router.put("/threshold/:id", InventoryController.updateThreshold);

// Route to fetch dashboard stats
router.get("/dashboard/stats", InventoryController.getDashboardStats);

module.exports = router;
