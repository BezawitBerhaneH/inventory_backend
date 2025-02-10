const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db"); // Fix: Use sequelize instead of db

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderRole: {
    type: DataTypes.ENUM("procurement officer", "supplier"),
    allowNull: false,
  },
  recipientID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Message;
