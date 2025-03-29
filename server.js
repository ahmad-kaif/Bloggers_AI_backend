const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());  // to parse request body into JSON
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow CORS for frontend
app.use(cookieParser()); // to parse cookies from request headers

// Connect to DB
connectDB();

// Routes
app.use("/auth", require("./routes/authRoutes.js")); // http://localhost:5000/auth
app.use("/posts", require("./routes/postRoutes.js")); // http://localhost:5000/posts

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
