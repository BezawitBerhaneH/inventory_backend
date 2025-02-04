const express = require('express');
const { authMiddleware } = require("../controllers/LoginController"); // Import authMiddleware
const OrderController = require("../controllers/OrderController"); // Import OrderController

const router = express.Router();

// Route to fetch orders for a supplier
router.get("/orders", authMiddleware, OrderController.fetchOrdersForSupplier);
router.post("/confirm", authMiddleware, OrderController.confirmOrder);

// Route to fetch orders pending inspection
router.get("/inspection/orders", authMiddleware, OrderController.fetchOrdersForInspection);

// Route to inspect an order
router.post("/inspection/inspect", authMiddleware, OrderController.inspectOrder);
//when delivered
router.post("/deliver",authMiddleware, OrderController.markOrderAsDelivered);
module.exports = router;
