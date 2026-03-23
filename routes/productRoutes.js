import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getTopMenProducts,
  getTopWomenProducts,
  getNewestProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Route gốc: /api/products
router.route("/").get(getAllProducts);

// Route lấy theo Slug: /api/products/slug/dong-ho-abc
router.route("/slug/:slug").get(getProductBySlug);
router.route("/top-men").get(getTopMenProducts);
router.route("/top-women").get(getTopWomenProducts);
router.route("/newest").get(getNewestProducts);

// Route lấy theo ID: /api/products/12345
router.route("/:id").get(getProductById);

export default router;
