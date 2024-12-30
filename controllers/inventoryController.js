const Inventory = require("../models/inventoryModel");
const InternalRequest = require("../models/internalrequest");
const { authMiddleware } = require("./LoginController");

const InventoryController = {
  getAll: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    try {
      const inventory = await Inventory.findAll({
        attributes: ["itemName", "quantity", "threshold"],
      });
      res.json(inventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      res.status(500).json({ message: "Error fetching inventory" });
    }
  },

  add: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const { itemName, quantity, typeID, threshold } = req.body;
    if (!itemName || !quantity || !typeID || threshold === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newItem = await Inventory.create({
        itemName,
        quantity,
        typeID,
        threshold,
      });
      res.status(201).json({ message: "Item added", id: newItem.inventoryID });
    } catch (err) {
      console.error("Error adding inventory:", err);
      res.status(500).json({ message: "Error adding inventory" });
    }
  },

  approveRequest: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const { requestID } = req.params;

    try {
      const request = await InternalRequest.findByPk(requestID);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "Pending") {
        return res
          .status(400)
          .json({ message: "Request is already approved or rejected" });
      }

      const inventoryItem = await Inventory.findOne({
        where: { itemName: request.reqitem },
      });

      if (!inventoryItem) {
        return res
          .status(404)
          .json({ message: "Inventory item not found for the request" });
      }

      if (inventoryItem.quantity < request.quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient inventory to approve request" });
      }

      inventoryItem.quantity -= request.quantity;
      await inventoryItem.save();

      request.status = "Approved";
      await request.save();

      res.json({ message: "Request approved and inventory updated" });
    } catch (err) {
      console.error("Error approving request:", err);
      res.status(500).json({ message: "Error approving request" });
    }
  },

  updateThreshold: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const { id } = req.params;
    const { threshold } = req.body;

    if (threshold === undefined || isNaN(threshold)) {
      return res.status(400).json({ message: "Valid threshold is required" });
    }

    try {
      const [updatedRows] = await Inventory.update(
        { threshold },
        { where: { inventoryID: id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Threshold updated successfully" });
    } catch (err) {
      console.error("Error updating threshold:", err);
      res.status(500).json({ message: "Error updating threshold" });
    }
  },

  getDashboardStats: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    try {
      const activeInventoryItems = await Inventory.count();
      res.json({ activeInventoryItems });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  },

  requestItem: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "department") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { itemName, requestedQuantity } = req.body;
    const requestedBy = req.user.userID;

    if (!itemName || !requestedQuantity || isNaN(requestedQuantity) || requestedQuantity <= 0) {
      return res.status(400).json({ message: "Item name and a positive, valid quantity are required" });
    }

    try {
      const inventoryItem = await Inventory.findOne({ where: { itemName } });

      if (!inventoryItem) {
        return res
          .status(404)
          .json({ message: `Item '${itemName}' not found in inventory` });
      }

      if (inventoryItem.quantity < requestedQuantity) {
        return res.status(400).json({
          message: `Insufficient quantity for '${itemName}'. Available: ${inventoryItem.quantity}`,
        });
      }

      const newRequest = await InternalRequest.create({
        reqitem: itemName,
        quantity: requestedQuantity,
        requestedBy,
        status: "Pending",
      });

      res.status(201).json({
        message: `Request for '${itemName}' submitted successfully`,
        requestID: newRequest.reqid,
      });
    } catch (err) {
      console.error("Error processing item request:", err);
      res.status(500).json({ message: "Error processing item request" });
    }
  },
};

module.exports = InventoryController;
