import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createPurchase, getPurchasesByUserId } from "../controllers/purchase.controller";

const router = Router();

router.post("/",authMiddleware,createPurchase);
router.get("/users/:userId",authMiddleware,getPurchasesByUserId);

export default router;