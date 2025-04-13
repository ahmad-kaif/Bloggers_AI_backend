import express from "express";

import { register, login, logout } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


router.get("/check", authMiddleware, (req, res) => {
    res.status(200).json({ message: "User is authenticated", user: req.user });
  });

export default router;
