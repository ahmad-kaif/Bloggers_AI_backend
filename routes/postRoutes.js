
import { createPost, getAllPosts, updatePost, deletePost } from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
