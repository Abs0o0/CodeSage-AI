import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMe,
  updateMe,
  changePassword,
  deactivateAccount,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.patch("/me/password", authMiddleware, changePassword);
router.patch("/me/deactivate", authMiddleware, deactivateAccount);

export default router;