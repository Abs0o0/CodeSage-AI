import express from "express";

import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  loginLimiter,
  refreshLimiter,
  registerLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshLimiter, refresh);
router.post("/logout", authLimiter, logout);
router.get("/me", authMiddleware, me);

export default router;