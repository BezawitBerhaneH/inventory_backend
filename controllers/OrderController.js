const PurchaseOrder = require("../models/PurchaseOrder");

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

      if (!orderID || !deliveryInfo ||!deliveryDate) {
        return res.status(400).json({ message: "Order ID and delivery information are required" });
      }
 // Validate deliveryDate format (optional)
 const isValidDate = !isNaN(Date.parse(deliveryDate));
 if (!isValidDate) {
   return res.status(400).json({ message: "Invalid delivery date format" });
 }
      // Find the order
      const order = await PurchaseOrder.findOne({
        where: { orderID, supplierID },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found for this supplier" });
      }

      // Update order status and delivery info
      order.deliveryInfo = deliveryInfo;
      order.deliveryDate = deliveryDate; // Save deliveryDate
      order.confirmed = true;  // Mark the order as confirmed by the supplier
      order.status = "confirmed";  // Change status to confirmed or any other suitable status

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
};

module.exports = OrderController;
