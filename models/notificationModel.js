const db = require('./db');

const notificationModel = {
  // Count purchase requests with an empty status
  countEmptyStatusRequests: (callback) => {
    const sql = `SELECT COUNT(*) AS count FROM purchaseRequest WHERE status = '' OR status IS NULL`;
    db.query(sql, callback);
  },

  // Insert a new notification into the notifications table
  insertNotification: (message, callback) => {
    const sql = "INSERT INTO notifications (message, status) VALUES (?, ?)";
    const status = "pending"; // Default status for new notifications
    db.query(sql, [message, status], callback);
  },

  // Get all notifications
  getAllNotifications: (callback) => {
    const sql = "SELECT * FROM notifications";
    db.query(sql, callback);
  }
};

module.exports = notificationModel;
