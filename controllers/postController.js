import { Post } from "../models/Post.js";
import axios from "axios";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const python_url_production="https://sentiment-service-bloggersai.onrender.com";
    const python_url_development="http://localhost:5001";
    
    // 🔍 Analyze sentiment via Python API
    const { data } = await axios.post(`${python_url_production}/analyze`, {
      text: content,
    });
    console.log(data)
    const sentiment = data.polarity;
    console.log("Sentimenttttttt:", sentiment);

    let sentimentEmoji = "😐";

    if (sentiment > 0.2) {
      sentimentEmoji = "😊"; // Positive
    } else if (sentiment < -0.2) {
      sentimentEmoji = "😞"; // Negative
    }

    const post = new Post({
      title,
      content,
      userId: req.user.id,
      sentiment,
      mood: sentimentEmoji,
    });

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
  try {
    const posts = await Post.find({ userId: req.user.id }); // Only fetch user's posts
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔍 Re-analyze sentiment on updated content
    const { data } = await axios.post(`${python_url_production}/analyze`, {
      text: content,
    });

    const sentiment = data.polarity;
    let sentimentEmoji = "😐";
    if (sentiment > 0.2) {
      sentimentEmoji = "😊";
    } else if (sentiment < -0.2) {
      sentimentEmoji = "😞";
    }

    // 📝 Update fields
    post.title = title;
    post.content = content;
    post.sentiment = sentiment;
    post.mood = sentimentEmoji;

    await post.save();

    res.json({ message: "Post updated", post });
  } catch (error) {
    console.error("Error updating post:", error?.response?.data || error.message || error);
    res.status(500).json({ message: "Error updating post", error });
  }
};


export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post || post.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
