const models = require('./models');

// Root route to fetch system admin data
const getSystemAdmins = async (req, res) => {
  try {
    const data = await models.getSystemAdmins();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: "Error fetching data from the database" });
  }
};

// POST route to add an inventory item
const addInventoryItem = async (req, res) => {
  const { itemName, quantity, typeID, threshold } = req.body;
  if (!itemName || !quantity || !typeID || threshold === undefined) {
    return res.status(400).json({ message: "Item name, quantity, typeID, and threshold are required" });
  }

  try {
    const id = await models.addInventoryItem(itemName, quantity, typeID, threshold);
    res.status(201).json({ message: "Inventory item added successfully", id });
  } catch (err) {
    console.error('Error inserting inventory data:', err);
    res.status(500).json({ message: "Error inserting inventory data into the database" });
  }
};

// GET route to fetch inventory data (only itemName and threshold)
const getInventory = async (req, res) => {
  try {
    const data = await models.getInventory();
    res.json(data);
  } catch (err) {
    console.error('Error fetching inventory data:', err);
    res.status(500).json({ message: "Error fetching inventory data from the database" });
  }
};

// PUT route to update inventory threshold
const updateThreshold = async (req, res) => {
  const { id } = req.params;
  const { threshold } = req.body;
  if (threshold === undefined || isNaN(threshold)) {
    return res.status(400).json({ message: "Threshold value is required and must be a valid number" });
  }

  try {
    const result = await models.updateThreshold(id, threshold);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json({ message: "Threshold updated successfully" });
  } catch (err) {
    console.error("Error updating threshold:", err);
    res.status(500).json({ message: "Error updating threshold in the database" });
  }
};

// PUT route to update system admin data
const updateSystemAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone, role } = req.body;
  if (!name || !email || !address || !phone || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await models.updateSystemAdmin(id, name, email, address, phone, role);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "System admin not found" });
    }
    res.json({ message: "System admin data updated successfully" });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ message: "Error updating data into the database" });
  }
};

// DELETE route to remove system admin data
const deleteSystemAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await models.deleteSystemAdmin(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "System admin not found" });
    }
    res.json({ message: "System admin data deleted successfully" });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ message: "Error deleting data from the database" });
  }
};

// GET route to fetch dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeInventoryItems] = await models.getDashboardStats();
    res.json({ totalUsers, activeInventoryItems });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

module.exports = {
  getSystemAdmins,
  addInventoryItem,
  getInventory,
  updateThreshold,
  updateSystemAdmin,
  deleteSystemAdmin,
  getDashboardStats
};
