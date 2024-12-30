const { DataTypes } = require("sequelize");
const sequelize = require("./db"); // Update the path as needed

const InternalRequest = sequelize.define(
  "InternalRequest",
  {
    reqid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reqitem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "internal_requests",
    timestamps: false,
  }
);

module.exports = InternalRequest;
