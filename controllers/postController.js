import { Post } from "../models/Post.js";
import axios from "axios";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // 🔍 Analyze sentiment via Python API
    const { data } = await axios.post("http://sentiment:5001/analyze", {
      text: content,
    });
    

    const sentiment = data.polarity;
    // console.log("Sentiment:", sentiment);

    let sentimentEmoji = "😐";

    if (sentiment > 0.3) {
      sentimentEmoji = "😊"; // Positive
    } else if (sentiment < -0.3) {
      sentimentEmoji = "😞"; // Negative
    }

    const post = new Post({ title, content, userId: req.user.id, sentiment, mood:sentimentEmoji });

    await post.save();
    res.json({ message: "Post created", post });
  } catch (error) {
    console.error(
      "Error creating post:",
      error?.response?.data || error.message || error
    );
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post || post.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  post.title = title;
  post.content = content;
  await post.save();

  res.json({ message: "Post updated", post });
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post || post.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
