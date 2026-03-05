import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
} from "../controllers/productController.js";

const router = express.Router();

// Route gốc: /api/products
router.route("/").get(getAllProducts);

// Route lấy theo Slug: /api/products/slug/dong-ho-abc
router.route("/slug/:slug").get(getProductBySlug);

// Route lấy theo ID: /api/products/12345
router.route("/:id").get(getProductById);

export default router;
