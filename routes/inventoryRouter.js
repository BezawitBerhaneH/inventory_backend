const express = require("express");
const { authMiddleware } = require("../controllers/LoginController");
const InventoryController = require("../controllers/inventoryController");

const router = express.Router();

// Route to fetch all inventory items
router.get("/", authMiddleware,InventoryController.getAll);

// Route to add a new inventory item
router.post("/add",authMiddleware, InventoryController.add);

// Route to request an item from the inventory
router.post("/request",authMiddleware, InventoryController.requestItem);

// Route to approve a specific request
router.post("/approve/:requestID",authMiddleware, InventoryController.approveRequest);

// Route to update the threshold of an inventory item
router.put("/threshold/:id",authMiddleware, InventoryController.updateThreshold);

// Route to fetch dashboard stats
router.get("/dashboard/stats", InventoryController.getDashboardStats);

module.exports = router;
