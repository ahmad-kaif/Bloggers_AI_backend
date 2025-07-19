
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user){
      console.log("user not found");
      return res.status(401).json({ message: "User not found" });
     
    }
    // console.log('good till here')

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // console.log('good till here as well')

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "1h"});
    //  console.log('good till here as well yeahh')
    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure:true,
      sameSite:"None",
    });
    // console.log('good till here as well yeahh')

    res.status(201).json({ message: "Logged in successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};


