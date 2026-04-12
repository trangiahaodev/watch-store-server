import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

// 1. Config
dotenv.config();
connectDB();

const app = express();

// 2. Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Để đọc được JSON từ body request

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(process.cwd(), "swagger.yaml");
const swaggerDocument = yaml.load(swaggerPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

// Route mặc định để test server sống hay chết
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
