import { Router } from "express";
import {
  createChannel,
  deleteChannel,
} from "../controllers/channelControllers";
import { authenticateToken } from "../middleware/authMiddleware";
import { ROUTES } from "../constants/routeName";

const router = Router();

router.post(ROUTES.CHANNEL.CREATE, authenticateToken, createChannel);
router.delete(ROUTES.CHANNEL.DELETE, authenticateToken, deleteChannel);

export default router;
