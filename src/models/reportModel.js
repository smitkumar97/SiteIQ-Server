const { DataTypes } = require("sequelize");
const sequelize = require("../config//db");

const Report = sequelize.define("Report", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performanceScore: DataTypes.INTEGER,
  seoScore: DataTypes.INTEGER,
  accessibilityScore: DataTypes.INTEGER,
  bestPracticesScore: DataTypes.INTEGER,
  recommendations: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Report;
