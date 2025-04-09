
import { createPost, getAllPosts, updatePost, deletePost } from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/get",authMiddleware ,getAllPosts);
router.put("/update/:id", authMiddleware, updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);

export default router;
