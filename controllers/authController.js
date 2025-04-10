
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    if(user){
      return res.status(400).json({ message: "User already exists" });
    }
    await user.save();
    
    res.json({ message: "User registered!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h"});

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite:"Strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

