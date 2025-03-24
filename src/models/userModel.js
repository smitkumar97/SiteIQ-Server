const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import database connection

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscriptionPlan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'free'
  }
});

module.exports = User;
