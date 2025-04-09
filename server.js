import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());  // to parse request body into JSON
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow CORS for frontend
app.use(cookieParser()); // to parse cookies from request headers

// Connect to DB
connectDB();

// Routes
app.use("/auth", authRoutes); // http://localhost:5000/auth
app.use("/posts", postRoutes); // http://localhost:5000/posts

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
