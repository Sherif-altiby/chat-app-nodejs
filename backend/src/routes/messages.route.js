import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessages, deleteMessage, getUsersForSidebar } from "../controllers/messages.controller.js";

const router = express.Router();

router.post('/send/:id', authMiddleware, sendMessage);

router.get('/users', authMiddleware, getUsersForSidebar);
router.get('/:id', authMiddleware, getMessages);

router.delete('/delete-message/:id', authMiddleware, deleteMessage);

export default router;


