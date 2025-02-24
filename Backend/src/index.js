import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { userRouter, authRouter, productRouter, orderRouter } from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import router from "./route/uploadRoutes.js";
import { createUploadsFolder } from "./security/helper.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.use("/api/file", router);
createUploadsFolder();

app.listen(4000, function () {
  console.log("project running on port 4000");
  db();
});