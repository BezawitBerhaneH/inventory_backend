const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your sequelize connection
const SystemAdmin = require('./SystemAdminModel'); // Assuming you have this model defined

const PurchaseRequest = sequelize.define('PurchaseRequest', {
  requestID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  itemDetails: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deliveryRequirements: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  requestedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'purchaseRequest', // Ensure the table name matches the actual table
  timestamps: false,
});

// Create a new purchase request
const createRequest = (itemDetails, quantity, deliveryRequirements, requestedBy, callback) => {
  PurchaseRequest.create({
    itemDetails,
    quantity,
    deliveryRequirements,
    requestedBy,
  })
    .then(() => callback(null))
    .catch((err) => callback(err));
};

// Fetch all purchase requests
const getAllRequests = (callback) => {
  PurchaseRequest.findAll({
    include: [{
      model: SystemAdmin,
      as: 'requestedBy'
    }]
  })
    .then((requests) => callback(null, requests))
    .catch((err) => callback(err));
};

module.exports = { createRequest, getAllRequests };
