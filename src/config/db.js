// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: "postgres",
//   port: process.env.DB_PORT || 5432,
//   logging: console.log,
// });

// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Database connected successfully!"))
//   .catch((err) => console.error("❌ Database connection error:", err));

// module.exports =  sequelize;


const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
