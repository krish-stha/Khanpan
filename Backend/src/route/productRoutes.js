// routes/productRoutes.js
import express from "express";
import { productController } from "../controller/productController.js";
import { authenticateToken } from "../middleware/token-middleware.js";

const router = express.Router();

router.get("/", authenticateToken, productController.getAll);
router.post("/", authenticateToken, productController.create);
router.put("/:id", authenticateToken, productController.update);
router.get("/:id", authenticateToken, productController.getById);
router.delete("/:id", authenticateToken, productController.deleteById);

export { router as productRouter };

