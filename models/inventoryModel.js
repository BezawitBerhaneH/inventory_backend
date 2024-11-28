const db = require('./db');

const InventoryModel = {
  getAll: (callback) => {
    const sql = "SELECT itemName, threshold FROM inventory";
    db.query(sql, callback);
  },
  add: (data, callback) => {
    const sql = "INSERT INTO inventory (itemName, quantity, typeID, threshold) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.itemName, data.quantity, data.typeID, data.threshold], callback);
  },
  updateThreshold: (id, threshold, callback) => {
    const sql = "UPDATE inventory SET threshold = ? WHERE inventoryID = ?";
    db.query(sql, [threshold, id], callback);
  },
  getDashboardStats: (callback) => {
    const inventoryCountQuery = "SELECT COUNT(*) AS activeInventoryItems FROM inventory";
    db.query(inventoryCountQuery, callback);
  },
};

module.exports = InventoryModel;
