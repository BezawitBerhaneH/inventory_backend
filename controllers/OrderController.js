const PurchaseOrder = require("../models/PurchaseOrder");
const { authMiddleware } = require("./LoginController");

const OrderController = {
  // Method to fetch orders for a supplier
  fetchOrdersForSupplier: async (req, res) => {
    try {
      const supplierID = req.user?.supplierID;

      if (!supplierID) {
        return res.status(400).json({ message: "Supplier ID is required" });
      }

      const orders = await PurchaseOrder.findAll({
        where: { supplierID },
      });

      res.status(200).json({
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "An error occurred while fetching orders" });
    }
  },

  // Method to confirm the order and delivery information
  confirmOrder: async (req, res) => {
    try {
      const { orderID, deliveryInfo, deliveryDate } = req.body;
      const supplierID = req.user?.supplierID;

      if (!supplierID) {
        return res.status(400).json({ message: "Supplier ID is required" });
      }

      if (!orderID || !deliveryInfo || !deliveryDate) {
        return res.status(400).json({ message: "Order ID, delivery information, and delivery date are required" });
      }

      const isValidDate = !isNaN(Date.parse(deliveryDate));
      if (!isValidDate) {
        return res.status(400).json({ message: "Invalid delivery date format" });
      }

      const order = await PurchaseOrder.findOne({
        where: { orderID, supplierID },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found for this supplier" });
      }

      order.deliveryInfo = deliveryInfo;
      order.deliveryDate = deliveryDate;
      order.confirmed = true;
      order.status = "confirmed";

      await order.save();

      res.status(200).json({
        message: "Order confirmed successfully",
        order,
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      res.status(500).json({ message: "An error occurred while confirming the order" });
    }
  },

  // Method to fetch orders for inspection
  fetchOrdersForInspection: async (req, res) => {
    if (req.user.role !== "quality inspector") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const orders = await PurchaseOrder.findAll({
        where: { qualityInspectionStatus: "pending", status:"delivered",delivered: 1  },
      });

      res.status(200).json({
        message: "Orders fetched for inspection",
        orders,
      });
    } catch (error) {
      console.error("Error fetching inspection orders:", error);
      res.status(500).json({ message: "An error occurred while fetching inspection orders" });
    }
  },
  // Method to mark an order as delivered
  markOrderAsDelivered: async (req, res) => {
    try {
      const { orderID } = req.body;
      const supplierID = req.user?.supplierID;

      if (!supplierID) {
        return res.status(400).json({ message: "Supplier ID is required" });
      }

      if (!orderID) {
        return res.status(400).json({ message: "Order ID is required" });
      }

    

      const order = await PurchaseOrder.findOne({
        where: { orderID, supplierID },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found for this supplier" });
      }

     
      order.delivered = true;
      order.status = "delivered";

      await order.save();

      res.status(200).json({
        message: "Delivered",
        order,
      });
    } catch (error) {
      console.error("Error delivering order:", error);
      res.status(500).json({ message: "An error occurred while delivering the order" });
    }
  },

  // Method to inspect an order
  inspectOrder: async (req, res) => {
    if (req.user.role !== "quality inspector") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const { orderID, status, note } = req.body;

      if (!orderID || !status) {
        return res.status(400).json({ message: "Order ID and status are required" });
      }

      const order = await PurchaseOrder.findOne({ where: { orderID } });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (!order.delivered) {
        return res.status(400).json({ message: "Only delivered orders can be inspected" });
    }

      if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
      }

      order.qualityInspectionStatus = status;
      order.qualityInspectorID = req.user?.id;
      order.qualityInspectionNote = note;

      if (status === "approved") {
        order.status = "ready_for_warehouse";
      } else {
        order.status = "rejected_by_quality";
      }

      await order.save();

      res.status(200).json({
        message: `Order ${status} successfully`,
        order,
      });
    } catch (error) {
      console.error("Error inspecting order:", error);
      res.status(500).json({ message: "An error occurred while inspecting the order" });
    }
  },
  
};

module.exports = OrderController;
