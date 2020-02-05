const cors = require("cors");
const express = require("express");
const methodOverride = require("method-override");

const { connectMongoDB } = require("./util/db");
connectMongoDB(); // Connect to MongoDB, create GridFs collections & Initialise GridFsStorage

// Initalise express app
const app = express();

// Initalise express app on a port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));

// Require routes
const posts = require("./routes/posts");
const users = require("./routes/users");

// Routes
app.use("/api/v1/posts", posts);
app.use("/api/v1/users", users);

// Start express app on PORT variable
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
