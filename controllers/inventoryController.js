const InventoryModel = require('../models/inventoryModel');

const InventoryController = {
  getAll: (req, res) => {
    InventoryModel.getAll((err, data) => {
      if (err) return res.status(500).json({ message: "Error fetching inventory" });
      return res.json(data);
    });
  },
  add: (req, res) => {
    const { itemName, quantity, typeID, threshold } = req.body;
    if (!itemName || !quantity || !typeID || threshold === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    InventoryModel.add({ itemName, quantity, typeID, threshold }, (err, result) => {
      if (err) return res.status(500).json({ message: "Error adding inventory" });
      return res.status(201).json({ message: "Item added", id: result.insertId });
    });
  },
  updateThreshold: (req, res) => {
    const { id } = req.params;
    const { threshold } = req.body;
    if (threshold === undefined || isNaN(threshold)) {
      return res.status(400).json({ message: "Valid threshold is required" });
    }
    InventoryModel.updateThreshold(id, threshold, (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating threshold" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });
      return res.json({ message: "Threshold updated successfully" });
    });
  },
};

module.exports = InventoryController;
