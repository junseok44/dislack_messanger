import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  checkAuth,
  logout,
} from "../controllers/authControllers";
import { authenticateToken } from "../middleware/authMiddleware";
import { ROUTES } from "../constants/routeName";

const router = Router();

router.post(ROUTES.AUTH.REGISTER, register);
router.post(ROUTES.AUTH.LOGIN, login);
router.get(ROUTES.AUTH.CHECK_AUTH, authenticateToken, checkAuth);
router.post(ROUTES.AUTH.REFRESH_TOKEN, refreshToken);
router.post(ROUTES.AUTH.LOGOUT, logout);

export default router;
