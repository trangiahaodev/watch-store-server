import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products - Lấy toàn bộ danh sách
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log(`getAllProducts in productRoutes.js: `, error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET /api/products/:id - Lấy chi tiết 1 sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }
  } catch (error) {
    console.log(`getProductById in productRoutes.js: `, error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
