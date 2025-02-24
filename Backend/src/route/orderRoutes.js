// routes/orderRoutes.js
import express from "express";

import { authenticateToken } from "../middleware/token-middleware.js";
import { orderController } from "../controller/orderController.js";

const router = express.Router();

router.get("/", authenticateToken, orderController.getAll);
router.post("/", authenticateToken, orderController.create);
router.put("/:id", authenticateToken, orderController.update);
router.get("/:id", authenticateToken, orderController.getById);
router.delete("/:id", authenticateToken, orderController.deleteById);

export { router as orderRouter };