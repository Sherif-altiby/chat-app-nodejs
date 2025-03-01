import express from "express";
import { checkAuth, login, logout, register, updateProfileAvatar } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadAvatarMiddleware } from "../middlewares/multer.js";

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authMiddleware, logout);

router.put('/update-profile-avatar', authMiddleware, uploadAvatarMiddleware, updateProfileAvatar);
router.get('/check', authMiddleware, checkAuth);

export default router;
