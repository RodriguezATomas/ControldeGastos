import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshTokens,
  register,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
} from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-tokens", refreshTokens);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-verification-email", sendVerificationEmail);
router.post("/verify-email", verifyEmail);

export default router;
