import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route gốc: /api/products
router.route("/").get(getAllProducts).post(protect, admin, createProduct);

// Route lấy theo Slug: /api/products/slug/dong-ho-abc
router.route("/slug/:slug").get(getProductBySlug);

// Route lấy theo ID: /api/products/12345
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
