// routes/orderRoutes.js
import express from "express";
import { orderController } from "../controller/orderController.js";
import { authenticateToken } from "../middleware/token-middleware.js";

const router = express.Router();

router.get("/", authenticateToken, orderController.getAll);
router.post("/", authenticateToken, orderController.create);
router.patch("/:id", authenticateToken, orderController.update);
router.get("/:id", authenticateToken, orderController.getById);
router.delete("/:id", authenticateToken, orderController.deleteById);

export { router as orderRouter };