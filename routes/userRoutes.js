import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Đăng ký user
router.route("/").post(registerUser);

// Đăng nhập
router.post("/login", authUser);

// Lấy thông tin cá nhân (Có gắn middleware 'protect' để bảo vệ)
router.route("/profile").get(protect, getUserProfile);

export default router;
