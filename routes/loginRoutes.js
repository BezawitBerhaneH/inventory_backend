const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/LoginController");

// Login route
router.post("/login", LoginController.loginUser);

// Update password route
router.put("/update-password", LoginController.updatePassword);

module.exports = router;
