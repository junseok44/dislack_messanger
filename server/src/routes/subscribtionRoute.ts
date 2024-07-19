import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/subscriptionController";

const router = Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", handleWebhook);

export default router;
