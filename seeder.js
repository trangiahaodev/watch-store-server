// server/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import Model (Nhớ phải có đuôi .js vì đang chạy mode ES Modules)
// Nếu ông chưa export default ở model thì sửa thành import { Product }...
import Product from "./models/Product.js";

dotenv.config();

// Cấu hình đường dẫn cho ES Modules (Fix lỗi __dirname không tồn tại)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- ĐOẠN QUAN TRỌNG NHẤT: ĐỌC FILE JSON BẰNG FS ---
// Thay vì import, ta đọc file text rồi parse ra. Cách này không bao giờ lỗi.
const productsPath = path.join(__dirname, "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // 1. Xóa dữ liệu cũ
    await Product.deleteMany();
    console.log("🗑️  Data Destroyed...");

    // 2. Chèn dữ liệu mới từ file JSON
    await Product.insertMany(products);
    console.log("🎉 Data Imported Successfully!");

    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

// Chạy script
connectDB().then(importData);
