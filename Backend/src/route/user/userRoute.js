import express from "express";
import { userController } from "../../controller/index.js";
import { authenticateToken } from "../../middleware/token-middleware.js";
const router = express.Router();
router.get("/",authenticateToken,userController.getAll);

router.post("/", userController.create);
router.put("/:id", userController.update);

router.get("/:id", userController.getById);
router.delete("/:id", userController.delelteById);

export { router as userRouter };

// app.use(authenticateToken);
// 