import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema } from "../infra/validate/auth.schemas";
import { AuthService } from "../services/auth/auth.service";

export class AuthController {
    static async register(req: Request, res: Response) {
        const body = registerSchema.parse(req.body);
        const result = await AuthService.register(body.email, body.password);
        return res.status(201).json(result);
    }

    static async login(req: Request, res: Response) {
        const body = loginSchema.parse(req.body);
        const result = await AuthService.login(body.email, body.password);
        return res.status(200).json(result);
    }

    static async refresh(req: Request, res: Response) {
        const body = refreshSchema.parse(req.body);
        const result = await AuthService.refresh(body.refreshToken);
        return res.status(200).json(result);
    }

    static async logout(req: Request, res: Response) {
        const body = refreshSchema.parse(req.body);
        await AuthService.logout(body.refreshToken);
        return res.status(204).send();
    }
}
