const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your sequelize connection

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

// Sync the model with the database
sequelize.sync({ alter: true })
  .then(() => console.log("PurchaseRequest table has been created or updated."))
  .catch((err) => console.error("Error syncing the model:", err));

module.exports = PurchaseRequest;
