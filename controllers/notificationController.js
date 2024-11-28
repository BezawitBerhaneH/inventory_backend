const notificationModel = require("../models/notificationModel");

const notificationController = {
  // Check empty status requests and create notifications
  checkEmptyStatusRequests: (req, res) => {
    notificationModel.countEmptyStatusRequests((err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching data", error: err });
      }

      const count = result[0].count;
      if (count > 0) {
        const message = `There are ${count} purchase requests with an empty status.`;
        // Insert notification into the notifications table
        notificationModel.insertNotification(message, (err) => {
          if (err) {
            return res.status(500).json({ message: "Error inserting notification", error: err });
          }
          return res.status(200).json({ message: "Notification created", count });
        });
      } else {
        return res.status(200).json({ message: "No requests with empty status" });
      }
    });
  },

  // Fetch all notifications
  getAllNotifications: (req, res) => {
    notificationModel.getAllNotifications((err, notifications) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching notifications", error: err });
      }
      return res.status(200).json(notifications);
    });
  }
};

module.exports = notificationController;
