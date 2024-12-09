const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SystemAdminModel = require("../models/SystemAdminModel");

const saltRounds = 10;

// Middleware to check for admin or system admin role
const authMiddleware = require("../controllers/LoginController").authMiddleware;

const SystemAdminController = {
  getAll: async (req, res) => {
    // Make sure only admins can access this
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const systemAdmins = await SystemAdminModel.findAll();
      return res.json(systemAdmins);
    } catch (err) {
      console.error("Error fetching system admins:", err); // Detailed logging
      return res.status(500).json({ message: "Error fetching data" });
    }
  },

  update: async (req, res) => {
    // Only allow if the logged-in user has an admin role
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { name, email, address, phone, role } = req.body;

    if (!name || !email || !address || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const systemAdmin = await SystemAdminModel.findByPk(id);

      if (!systemAdmin) {
        return res.status(404).json({ message: "System admin not found" });
      }

      await systemAdmin.update({ name, email, address, phone, role });

      return res.json({ message: "System admin updated successfully" });
    } catch (err) {
      console.error("Error updating system admin:", err); // Detailed logging
      return res.status(500).json({ message: "Error updating data" });
    }
  },

  delete: async (req, res) => {
    // Only allow if the logged-in user has an admin role
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;

    try {
      const systemAdmin = await SystemAdminModel.findByPk(id);

      if (!systemAdmin) {
        return res.status(404).json({ message: "System admin not found" });
      }

      await systemAdmin.destroy();

      return res.json({ message: "System admin deleted successfully" });
    } catch (err) {
      console.error("Error deleting system admin:", err); // Detailed logging
      return res.status(500).json({ message: "Error deleting data" });
    }
  },

  getDashboardStats: async (req, res) => {
    // Allow anyone with a valid token to access stats, not restricted by role
    try {
      const totalUsers = await SystemAdminModel.count();
      return res.json({ totalUsers });
    } catch (err) {
      console.error("Error fetching stats:", err); // Detailed logging
      return res.status(500).json({ message: "Error fetching stats" });
    }
  },

  createAdminUser: async (req, res) => {
    // Only allow if the logged-in user has an admin role
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, email, address, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !address || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const username = email; // Set the username to the email
    const password = email; // Ideally, this should be securely generated or user-inputted

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newAdmin = await SystemAdminModel.create({
        username,
        password: hashedPassword,
        name,
        email,
        address,
        phone,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(201).json({
        message: "System admin user created successfully",
        id: newAdmin.userID, // Correct ID field
      });
    } catch (err) {
      console.error("Error creating system admin:", err); // Detailed logging
      return res.status(500).json({ message: "Error inserting system admin data into the database" });
    }
  },
};

module.exports = SystemAdminController;
