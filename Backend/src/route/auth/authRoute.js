import express from "express";
import { authController } from "../../controller/index.js";
import { authenticateToken } from "../../middleware/token-middleware.js";
const router = express.Router();
router.get("/me",authenticateToken, authController.getMe);
router.post("/login", authController.login);

export { router as authRouter };
