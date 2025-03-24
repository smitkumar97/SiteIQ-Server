const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema"); // GraphQL schema
const authRoutes = require('./src/routes/authRoute');
const reportRoutes = require('./src/routes/reportRoute');
const { sequelize } = require("./src/config/db");
const User = require("./src/models/userModel");
const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphQL UI
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
