import { Router } from "express";
import {
  createChannel,
  createMessage,
  deleteChannel,
  getChannelMessages,
} from "../controllers/channelControllers";
import { authenticateToken } from "../middleware/authMiddleware";
import { ROUTES } from "../constants/routeName";

const router = Router();

router.post(ROUTES.CHANNEL.CREATE, authenticateToken, createChannel);
router.delete(ROUTES.CHANNEL.DELETE, authenticateToken, deleteChannel);
router.get(ROUTES.CHANNEL.MESSAGES, authenticateToken, getChannelMessages);
router.post(ROUTES.CHANNEL.CREATE_MESSAGE, authenticateToken, createMessage);

export default router;
