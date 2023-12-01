const sequalize = require("../dbconfig");
const { DataTypes } = require("sequelize");
const Student = sequalize.define(
  "students",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    subjects: {
      type: DataTypes.ARRAY(DataTypes.JSON()),
      allowNull: false,
      defaultValue: [{}],
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: false,
    schema: "public",
  }
);
module.exports = Student;
