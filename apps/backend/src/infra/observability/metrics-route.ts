import { Request, Response } from "express";
import { register } from "./metrics";

export async function metricsHandler(
    _req: Request,
    res: Response
) {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
}
