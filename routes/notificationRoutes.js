const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Route to check empty status requests and create notifications
router.get("/check-empty-status", notificationController.checkEmptyStatusRequests);

// Route to get all notifications
router.get("/", notificationController.getAllNotifications);

module.exports = router;
