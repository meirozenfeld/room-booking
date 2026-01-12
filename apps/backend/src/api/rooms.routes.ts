import { Router } from "express";
import { validate } from "../infra/validate";
import { roomSearchQuerySchema } from "./rooms.schemas";
import { searchRoomsHandler } from "./rooms.controller";

const router = Router();

router.get(
    "/search",
    validate(roomSearchQuerySchema),
    searchRoomsHandler
);

export default router;
