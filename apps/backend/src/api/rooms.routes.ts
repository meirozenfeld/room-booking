import { Router } from "express";
import { validate } from "../infra/validate";
import { roomSearchQuerySchema } from "../infra/validate/rooms.schemas";
import { searchRoomsHandler } from "../controllers/rooms.controller";

const router = Router();

router.get(
    "/search",
    validate(roomSearchQuerySchema),
    searchRoomsHandler
);

export default router;
