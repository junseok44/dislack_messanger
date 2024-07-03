import { Router } from "express";
import { register, login, refreshToken, checkAuth } from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/check", checkAuth);

export default router;
