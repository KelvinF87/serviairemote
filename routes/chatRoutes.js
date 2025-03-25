import express from 'express';
import { chat } from '../controllers/chatController.js';
import { isAuthenticated, authorizeRoles } from "../middleware/jwt.middleware.js";
const router = express.Router();

router.post("/chat",isAuthenticated, chat);

export default router;