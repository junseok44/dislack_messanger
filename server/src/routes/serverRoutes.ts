import { Router } from "express";
import {
  createServer,
  deleteServer,
  getUserServersWithChannels,
} from "../controllers/serverControllers";
import { authenticateToken } from "../middleware/authMiddleware";
import { ROUTES } from "../constants/routeName";

const router = Router();

router.post(ROUTES.SERVER.CREATE, authenticateToken, createServer);
router.delete(ROUTES.SERVER.DELETE, authenticateToken, deleteServer);
router.get(
  ROUTES.SERVER.GET_USER_SERVERS_WITH_CHANNELS,
  authenticateToken,
  getUserServersWithChannels
);

export default router;
