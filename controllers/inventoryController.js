const Inventory = require("../models/inventoryModel");
const InternalRequest = require("../models/internalrequest");

const InventoryController = {
  getAll: async (req, res) => {
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

  requestItem: async (req, res) => {
    const { itemName, requestedQuantity } = req.body;

    if (!itemName || !requestedQuantity || isNaN(requestedQuantity)) {
      return res
        .status(400)
        .json({ message: "Item name and valid quantity are required" });
    }

    try {
      // Log the user to debug authentication issues
      console.log("Requesting user:", req.user);

      // Ensure the user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if the item exists and has sufficient quantity
      const inventoryItem = await Inventory.findOne({
        where: { itemName },
      });

      if (!inventoryItem) {
        return res
          .status(404)
          .json({ message: "Requested item is not available in inventory" });
      }

      if (inventoryItem.quantity < requestedQuantity) {
        return res
          .status(400)
          .json({ message: "Insufficient quantity in inventory" });
      }

      // Create a request in the internal request table
      const newRequest = await InternalRequest.create({
        reqitem: itemName,
        quantity: requestedQuantity,
        requestedBy: req.user.id,
      });

      res
        .status(201)
        .json({ message: "Request submitted", requestID: newRequest.reqid });
    } catch (err) {
      console.error("Error requesting item:", err);
      res.status(500).json({ message: "Error requesting item" });
    }
  },

  approveRequest: async (req, res) => {
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
    try {
      const activeInventoryItems = await Inventory.count();
      res.json({ activeInventoryItems });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  },
};

module.exports = InventoryController;
