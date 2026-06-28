import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getFeatures,
  getLanguages,
  getDashboard,
  getHistory,
} from "../controllers/content.controller.js";

const router = express.Router();

router.get("/features", getFeatures);
router.get("/languages", getLanguages);
router.get("/dashboard", authMiddleware, getDashboard);
router.get("/history", authMiddleware, getHistory);

export default router;