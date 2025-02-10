const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../models/db');
const Message = require('../models/Message');
const systemAdminModel = require('../models/systemAdminModel'); // Import SystemAdmin model
const supplier = require('../models/supplier'); // Import Supplier model
const { authMiddleware } = require('./LoginController');

const MessageController = {
  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { recipientID, message } = req.body;
      const senderRole = req.user.role;
      let senderID;
      if (req.user.role === 'procurement officer') {
          senderID = req.user.userID;
      } else if (req.user.role === 'supplier') {
          senderID = req.user.supplierID;
      } else {
          return res.status(400).json({ message: 'Invalid user role' });
      }

      if (!senderID) {
          return res.status(400).json({ message: 'Sender ID is missing' });
      }

      if (!recipientID || !message) {
        return res.status(400).json({ message: 'Recipient ID and message are required' });
      }

     

     

      // Create the message
      const newMessage = await Message.create({
        senderID,
        senderRole,
        recipientID,
        message,
      });

      res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Retrieve messages for the logged-in user
  getMessages: async (req, res) => {
    if (req.user.role === 'procurement officer'){
    try {
      const userID = req.user.userID;
      const messages = await Message.findAll({
        where: {
          [Sequelize.Op.or]: [
            { senderID: userID },
            { recipientID: userID },
            { senderRole: "procurement officer" },
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({ messages });
    }
    
    catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }}
    else if (req.user.role === 'supplier') {
      try {
      
        const supplierID = req.user.supplierID;
        const messages = await Message.findAll({
          where: {
            [Sequelize.Op.or]: [
              { senderID: supplierID },
              { recipientID: supplierID },
              { senderRole: "supplier" },
            ],
          },
          order: [['createdAt', 'DESC']],
        });
  
        res.status(200).json({ messages });
      }
      
      catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
      }

    }
    
  },
};

module.exports = MessageController;
