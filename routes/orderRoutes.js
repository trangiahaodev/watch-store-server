import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lịch sử mua hàng của tôi
router.route("/myorders").get(protect, getMyOrders);

// Vừa tạo đơn, vừa lấy danh sách (Admin)
// router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/").post(protect, addOrderItems).get(getOrders);

// Lấy chi tiết 1 đơn
// router.route("/:id").get(protect, getOrderById);
router.route("/:id").get(getOrderById);

// Các route cho Admin cập nhật trạng thái
// router.route("/:id/pay").put(protect, admin, updateOrderToPaid);
// router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

router.route("/:id/pay").put(updateOrderToPaid);
router.route("/:id/deliver").put(updateOrderToDelivered);

export default router;
