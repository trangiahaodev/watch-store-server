import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lưu ý thứ tự: Các route có chữ cụ thể (như 'myorders') phải đặt TRÊN route có tham số (như '/:id')

// Tạo đơn hàng mới
router.route("/").post(protect, addOrderItems);

// Lịch sử mua hàng của tôi
router.route("/myorders").get(protect, getMyOrders);

// Lấy chi tiết 1 đơn
router.route("/:id").get(protect, getOrderById);

export default router;
