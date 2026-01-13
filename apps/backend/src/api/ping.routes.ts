import { Router } from "express";
import { pingController } from "../controllers/ping.controller";
import { validate } from "../infra/validate";
import { pingSchema } from "../infra/validate/ping.schema";

const router = Router();

router.post("/ping", validate(pingSchema), pingController);

export default router;
