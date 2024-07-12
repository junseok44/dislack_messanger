import { Router } from "express";
import {
  createServer,
  deleteServer,
  getUserServersWithChannels,
  joinServer,
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
router.post(ROUTES.SERVER.JOIN, authenticateToken, joinServer);

export default router;
