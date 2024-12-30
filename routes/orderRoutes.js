const express = require('express');
const { authMiddleware } = require("../controllers/LoginController"); // Import authMiddleware
const OrderController = require("../controllers/OrderController"); // Import OrderController

const router = express.Router();

// Route to fetch orders for a supplier
router.get("/orders", authMiddleware, OrderController.fetchOrdersForSupplier);
router.post("/confirm", authMiddleware, OrderController.confirmOrder);
module.exports = router;
