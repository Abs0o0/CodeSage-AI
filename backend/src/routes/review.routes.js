import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  analyzeCode,
  applyFix,
  getHistory,
} from "../controllers/review.controller.js";
import { reviewLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/analyze", authMiddleware, reviewLimiter, analyzeCode);
router.post("/fix", authMiddleware, reviewLimiter, applyFix);
router.get("/history", authMiddleware, getHistory);

export default router;