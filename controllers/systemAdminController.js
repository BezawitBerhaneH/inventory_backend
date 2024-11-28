const bcrypt = require('bcrypt');
const SystemAdminModel = require('../models/SystemAdminModel');

const saltRounds = 10;

const SystemAdminController = {
  getAll: (req, res) => {
    SystemAdminModel.getAll((err, data) => {
      if (err) return res.status(500).json({ message: "Error fetching data" });
      return res.json(data);
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { name, email, address, phone, role } = req.body;
    if (!name || !email || !address || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    SystemAdminModel.update(id, { name, email, address, phone, role }, (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating data" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "System admin not found" });
      return res.json({ message: "System admin updated successfully" });
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    SystemAdminModel.delete(id, (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting data" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "System admin not found" });
      return res.json({ message: "System admin deleted successfully" });
    });
  },

  getDashboardStats: (req, res) => {
    SystemAdminModel.getDashboardStats((err, result) => {
      if (err) return res.status(500).json({ message: "Error fetching stats" });
      return res.json({ totalUsers: result[0].totalUsers });
    });
  },

  // Create a new system admin user
  createAdminUser: (req, res) => {
    const { name, email, address, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !address || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Set the username to the email
    const username = email;

    // Hash the password (using email for simplicity, but should ideally be a secure password)
    const password = email; // You can change this to a better approach, like generating a random password or prompting the user to input one

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: "Error hashing the password" });
      }

      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      // Call the model function to insert the new system admin
      SystemAdminModel.insert(username, hashedPassword, name, email, address, phone, role, createdAt, updatedAt, (err, result) => {
        if (err) {
          console.error('Error inserting system admin data:', err);
          return res.status(500).json({ message: "Error inserting system admin data into the database" });
        }
        return res.status(201).json({ message: "System admin user created successfully", id: result.insertId });
      });
    });
  },
};

module.exports = SystemAdminController;
