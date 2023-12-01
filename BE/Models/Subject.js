const sequalize = require("../dbconfig");
const { DataTypes } = require("sequelize");
const Subject = sequalize.define(
  "subjects",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    passmark: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentsIds: {
      type: DataTypes.ARRAY(DataTypes.BIGINT),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "subjects",
    timestamps: false,
    schema: "public",
  }
);
module.exports = Subject;
