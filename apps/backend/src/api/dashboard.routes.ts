import { Router } from "express";
import { authMiddleware } from "../infra/auth-middleware";
import { getDashboardHandler } from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authMiddleware, getDashboardHandler);

export default router;
