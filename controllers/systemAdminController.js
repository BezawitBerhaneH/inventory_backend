const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const SystemAdminModel = require("../models/SystemAdminModel");
const Supplier = require("../models/supplier"); // Changed from 'supplierController' to 'Supplier'

const RoleModel = require("../models/RoleModel");
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

  deactivate: async (req, res) => {
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

      // Check if the user is already deactivated
      if (systemAdmin.status === "deactivated") {
        return res.status(400).json({ message: "User is already deactivated" });
      }

      // Update the user's status to "deactivated"
      await systemAdmin.update({ status: "deactivated" });

      return res.json({ message: "System admin deactivated successfully" });
    } catch (err) {
      console.error("Error deactivating system admin:", err); // Detailed logging
      return res.status(500).json({ message: "Error deactivating user" });
    }
  },

  // Fetch all suppliers
  getAllSuppliers: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const suppliers = await Supplier.findAll(); // Directly use the Supplier model
      return res.json(suppliers);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ message: "Error fetching supplier data" });
    }
  },

  
createSupplier: async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { supplierName, phone, address, password } = req.body;

  // Check if all fields are provided
  if (!supplierName || !phone || !address || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the new supplier with the hashed password
    const newSupplier = await Supplier.create({
      supplierName,
      phone,
      address,
      password: hashedPassword,  // Store the hashed password
    });

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier: newSupplier,
    });
  } catch (err) {
    console.error("Error creating supplier:", err);
    return res.status(500).json({ message: "Error creating supplier" });
  }
},
  
  // Update an existing supplier
  updateSupplier: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const updatedSupplier = await Supplier.update(req.body, {
        where: { id },
      }); // Directly use the Supplier model
      return res.json({
        message: "Supplier updated successfully",
        supplier: updatedSupplier,
      });
    } catch (err) {
      console.error("Error updating supplier:", err);
      return res.status(500).json({ message: "Error updating supplier" });
    }
  },

  // Delete a supplier
  deleteSupplier: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;

    try {
      await Supplier.destroy({ where: { id } }); // Directly use the Supplier model
      return res.json({ message: "Supplier deleted successfully" });
    } catch (err) {
      console.error("Error deleting supplier:", err);
      return res.status(500).json({ message: "Error deleting supplier" });
    }
  },

  getAllRoles: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const roles = await RoleModel.findAll();
      return res.json(roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      return res.status(500).json({ message: "Error fetching roles" });
    }
  },

  // Create a new role
  createRole: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: "Role name is required" });
    }

    try {
      const newRole = await SystemAdminModel.create({
        roleName,
      });

      return res.status(201).json({ message: "Role created successfully", id: newRole.roleID });
    } catch (err) {
      console.error("Error creating role:", err);
      return res.status(500).json({ message: "Error creating role" });
    }
  },

  // Update an existing role
  updateRole: async (req, res) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: "Role name is required" });
    }

    try {
      const role = await SystemAdminModel.findByPk(id);

      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }

      await role.update({ roleName });

      return res.json({ message: "Role updated successfully" });
    } catch (err) {
      console.error("Error updating role:", err);
      return res.status(500).json({ message: "Error updating role" });
    }
  },
};

module.exports = SystemAdminController;
