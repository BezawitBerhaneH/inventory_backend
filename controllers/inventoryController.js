const Inventory = require("../models/inventoryModel");
const InternalRequest = require("../models/internalrequest");
const { authMiddleware } = require("./LoginController");
const PurchaseOrder = require("../models/PurchaseOrder");

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
  getInventoryStatusDistribution: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    try {
      // Fetch all inventory items
      const inventoryItems = await Inventory.findAll({
        attributes: ["itemName", "quantity", "threshold"],
      });

      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;

      // Classify inventory items based on their stock status
      inventoryItems.forEach(item => {
        if (item.quantity > item.threshold) {
          inStock++;
        } else if (item.quantity > 0 && item.quantity <= item.threshold) {
          lowStock++;
        } else {
          outOfStock++;
        }
      });

      // Return data for pie chart or other report types
      res.json({
        labels: ["In Stock", "Low Stock", "Out of Stock"],
        data: [inStock, lowStock, outOfStock]
      });
    } catch (err) {
      console.error("Error fetching inventory status distribution:", err);
      res.status(500).json({ message: "Error fetching inventory status distribution" });
    }
  },

  // Method to get inventory usage by requests (i.e., how much of each item has been requested)
  getInventoryUsageReport: async (req, res) => {
    // Ensure the user has the correct role
    if (req.user.role !== "inventory admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    try {
      // Fetch all approved internal requests (only consider requests that are 'approved')
      const requests = await InternalRequest.findAll({
        where: { status: "Approved" },
        attributes: ["reqitem", "quantity"]
      });

      const usageData = {};

      // Aggregate usage for each item
      requests.forEach(request => {
        if (usageData[request.reqitem]) {
          usageData[request.reqitem] += request.quantity;
        } else {
          usageData[request.reqitem] = request.quantity;
        }
      });

      // Format the data for the report (e.g., item names and their total usage)
      const labels = Object.keys(usageData);
      const data = Object.values(usageData);

      res.json({ labels, data });
    } catch (err) {
      console.error("Error fetching inventory usage report:", err);
      res.status(500).json({ message: "Error fetching inventory usage report" });
    }
  },
 // Method to fetch orders for inspection
 fetchOrdersForwarehouse: async (req, res) => {
  if (req.user.role !== "warehouse") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const orders = await PurchaseOrder.findAll({
      where: { status:"ready_for_warehouse"  },
    });

    res.status(200).json({
      message: "items to be logged",
      orders,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "An error occurred while fetching items" });
  }
},
logItemsToInventory: async (req, res) => {
  if (req.user.role !== "warehouse") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { orderID, deliveredQuantity } = req.body; // Expect orderID and deliveredQuantity in the request body

  try {
    const purchaseOrder = await PurchaseOrder.findByPk(orderID);

    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (purchaseOrder.status !== "ready_for_warehouse") {
      return res.status(400).json({ message: "Order is not ready for warehouse" });
    }

    // Check if item exists in inventory
    let inventoryItem = await Inventory.findOne({
      where: { itemName: purchaseOrder.itemDetails },
    });

    // If the item does not exist in inventory, create it
    if (!inventoryItem) {
      inventoryItem = await Inventory.create({
        itemName: purchaseOrder.itemDetails,
        quantity: deliveredQuantity,
        typeID: 1, // Use appropriate typeID based on your system
        threshold: 10, // Set threshold (could be dynamic or based on rules)
      });

      return res.status(201).json({ message: "New item added to inventory" });
    }

    // Update inventory with delivered quantity
    inventoryItem.quantity += deliveredQuantity;
    await inventoryItem.save();

    // Mark the purchase order as delivered
    purchaseOrder.status = "delivered";
    await purchaseOrder.save();

    res.json({ message: "Inventory updated successfully" });
  } catch (err) {
    console.error("Error processing delivered item:", err);
    res.status(500).json({ message: "Error processing delivered item" });
  }
},
};

module.exports = InventoryController;
