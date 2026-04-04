import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/admin-summary").get(getDashboardStats);

export default router;
