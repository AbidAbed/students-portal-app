const sequalize = require("../dbconfig");
const { DataTypes } = require("sequelize");
const User = sequalize.define(
  "users",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "student" },
    chat: {
      type: DataTypes.JSON(DataTypes.ARRAY()),
      allowNull: false,
      defaultValue: { 1: [{ id: 1, msg: "Hello there", time: 2 }] },
    },
  },
  {
    tableName: "users",
    timestamps: false,
    schema: "public",
  }
);
module.exports = User;
