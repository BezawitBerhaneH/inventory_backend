// models/purchaseOrder.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const PurchaseOrder = sequelize.define(
  'PurchaseOrder',
  {
    orderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    requestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    supplierID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    note: {
        type: DataTypes.TEXT,
        allowNull: true, // Null initially until a supplier is chosen
      },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Supplier confirmation, default is false
      },
  },
  {
    tableName: 'purchaseOrders',
    timestamps: false,
  }
);


sequelize
  .sync({ alter: true }) // Use alter: true to update the table structure if needed
  .then(() => {
    console.log('Supplier table has been created or updated.');
  })
  .catch((err) => {
    console.error('Error syncing the model:', err);
  });

module.exports = PurchaseOrder;
