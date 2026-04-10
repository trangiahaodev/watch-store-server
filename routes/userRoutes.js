import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  getCustomerDetail,
  toggleUserStatus,
  updateAdminNote,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tuyệt chiêu gộp Route: POST thì đăng ký, GET thì lấy danh sách (phải là admin)
router.route("/").post(registerUser).get(protect, admin, getUsers);

// Đăng nhập
router.post("/login", authUser);

// Lấy thông tin cá nhân (Đã fix bỏ :id trên URL bảo mật hơn)
router.route("/profile").get(protect, getUserProfile);

// Xem chi tiết hồ sơ của khách hàng
// router.route("/:id/detail").get(protect, admin, getCustomerDetail);
router.route("/:id/detail").get(getCustomerDetail); // Demo khi chua co Login

// Bật / Tắt trạng thái khóa tài khoản
// router.route("/:id/toggle-status").put(protect, admin, toggleUserStatus);
router.route("/:id/toggle-status").put(toggleUserStatus); // Demo khi chua co Login

// Lưu ghi chú nội bộ của sale/admin
// router.route("/:id/note").put(protect, admin, updateAdminNote);
router.route("/:id/note").put(updateAdminNote); // Demo khi chua co Login

export default router;
