import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createCheckoutSession,
  getCheckoutSession,
  handleWebhook,
} from "../controllers/subscriptionController";
import { ROUTES } from "../constants/routeName";

const router = Router();

router.post(
  ROUTES.SUBSCRIBE.CHECKOUT_SESSION,
  authenticateToken,
  createCheckoutSession
);
router.get(
  ROUTES.SUBSCRIBE.CHECKOUT_SESSION_COMPLETE,
  authenticateToken,
  getCheckoutSession
);
router.post(ROUTES.SUBSCRIBE.WEBHOOK, handleWebhook);

export default router;
