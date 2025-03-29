const express = require("express");
const { createPost, getAllPosts, updatePost, deletePost } = require("../controllers/postController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
