const express = require("express");
const router = express.Router();
const { LoginController, authMiddleware } = require("../controllers/LoginController");

// Login route
router.post("/login", LoginController.loginUser);

// Update password route (ensure it's protected if needed by authMiddleware)
router.put("/update-password", authMiddleware, LoginController.updatePassword);

module.exports = router;
