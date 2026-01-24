import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

// 1. Config
dotenv.config();
connectDB();

const app = express();

// 2. Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để đọc được JSON từ body request

// 3. Routes
app.use("/api/products", productRoutes);

// Route mặc định để test server sống hay chết
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
