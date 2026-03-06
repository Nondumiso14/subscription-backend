require("dotenv").config();
const express = require("express");

const app = express();

// Middleware to read JSON
app.use(express.json());

// Import routes
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});