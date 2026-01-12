import { Router } from "express";
import { pingController } from "./ping.controller";
import { validate } from "../infra/validate";
import { pingSchema } from "./ping.schema";

const router = Router();

router.post("/ping", validate(pingSchema), pingController);

export default router;
