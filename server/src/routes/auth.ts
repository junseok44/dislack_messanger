import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  checkAuth,
  logout,
} from "../controllers/auth";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", authenticateToken, checkAuth);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
