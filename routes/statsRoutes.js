import express from "express";
import { getAdminStats } from "../controllers/statsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/admin-summary").get(protect, admin, getAdminStats);

export default router;
