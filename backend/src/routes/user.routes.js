import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMe,
  updateMe,
  changePassword,
  deactivateAccount,
  uploadMyAvatar,
} from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.patch("/me/password", authMiddleware, changePassword);
router.patch("/me/deactivate", authMiddleware, deactivateAccount);
router.post("/me/avatar", authMiddleware, uploadAvatar, uploadMyAvatar);

export default router;