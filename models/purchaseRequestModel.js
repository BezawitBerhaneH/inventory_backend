const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your sequelize connection

// Define the PurchaseRequest model
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
  supplierID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null initially until a supplier is chosen
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true, // Null initially until a supplier is chosen
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
  tableName: 'purchaseRequest',
  timestamps: false,
});
sequelize.sync({ alter: true }) 
.then(() => {
  console.log("pr table has been created or updated.");
})
.catch((err) => {
  console.error("Error syncing the model:", err);
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
    .catch((err) => {
      console.error("Error in createRequest:", err.message);
      callback(err);
    });
};

// Fetch all purchase requests
const getAllRequests = (callback) => {
  PurchaseRequest.findAll()
    .then((requests) => callback(null, requests))
    .catch((err) => {
      console.error("Error in getAllRequests:", err.message);
      callback(err);
    });
};

const getPendingRequests = (callback) => {
  PurchaseRequest.findAll({ where: { status: 'Pending' } })
    .then((pendingRequests) => callback(null, pendingRequests))
    .catch((err) => {
      console.error("Error in getPendingRequests:", err.message);
      callback(err);
    });
};


// Approve a purchase request (updates status to 'Approved')
const approveRequest = async (requestID, supplierID, note) => {
  return PurchaseRequest.update(
    { status: "Approved", supplierID, Note: note },
    { where: { requestID, status: "Pending" } } // Ensure only pending requests are updated
  );
};


// Decline a purchase request (updates status to 'Declined')
const declineRequest = (requestID, callback) => {
  PurchaseRequest.update(
    { status: 'Declined' },
    { where: { requestID } }
  )
    .then(([affectedRows]) => {
      if (affectedRows === 0) {
        return callback(null, { message: 'Request not found' });
      }
      callback(null, { message: 'Request declined successfully' });
    })
    .catch((err) => callback(err));
};
const getRequestsByUser = (userID, callback) => {
  PurchaseRequest.findAll({ where: { requestedBy: userID } })
    .then((requests) => callback(null, requests))
    .catch((err) => {
      console.error("Error in getRequestsByUser:", err.message);
      callback(err);
    });
};
module.exports = { createRequest, getRequestsByUser, getAllRequests, approveRequest, declineRequest,getPendingRequests };
