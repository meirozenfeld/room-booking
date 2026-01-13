import { Router } from "express";
import { authMiddleware } from "../infra/auth-middleware";
import { getMeHandler } from "../controllers/users.controller";

const router = Router();

router.get("/me", authMiddleware, getMeHandler);

export default router;
