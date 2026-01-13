import { Request, Response } from "express";
import { pingService } from "../services/ping.service";

export function pingController(req: Request, res: Response) {
  const { message } = req.body;

  const result = pingService(message);

  res.status(200).json(result);
}
