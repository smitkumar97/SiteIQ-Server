const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { graphqlHTTP } = require("express-graphql");
const http = require("http");
const socketIo = require("socket.io");
const schema = require("./schema"); // GraphQL schema
const authRoutes = require("./src/routes/authRoute");
const reportRoutes = require("./src/routes/reportRoute");
const emailRoute = require("./src/routes/nodeMailer");
const connectDB = require("./src/config/db");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/visit", emailRoute);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphQL UI
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

const activeUsers = new Set();

io.on("connection", (socket) => {
  socket.emit("initial-count", activeUsers.size);

  socket.on("register-user", () => {
    if (!activeUsers.has(socket.id)) {
      activeUsers.add(socket.id);
      io.emit("active-users-update", activeUsers.size);
    }
  });

  socket.on("unregister-user", () => {
    if (activeUsers.has(socket.id)) {
      activeUsers.delete(socket.id);
      io.emit("active-users-update", activeUsers.size);
    }
  });

  socket.on("disconnect", () => {
    if (activeUsers.has(socket.id)) {
      activeUsers.delete(socket.id);
      io.emit("active-users-update", activeUsers.size);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
