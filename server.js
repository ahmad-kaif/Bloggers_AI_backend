import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
dotenv.config();


const app = express();

app.use(express.json());  // to parse request body into JSON
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(cookieParser()); 

connectDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

app.use("/auth", authRoutes); // http://localhost:8080/auth
app.use("/posts", postRoutes); // http://localhost:8080/posts


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
