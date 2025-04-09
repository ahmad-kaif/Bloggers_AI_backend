import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
dotenv.config();


const app = express();


app.use(express.json());  // to parse request body into JSON
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Allow CORS for frontend
app.use(cookieParser()); // to parse cookies from request headers

connectDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

app.use("/auth", authRoutes); // http://localhost:5000/auth
app.use("/posts", postRoutes); // http://localhost:5000/posts


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
