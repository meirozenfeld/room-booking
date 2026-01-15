import { Response } from "express";
import { AuthenticatedRequest } from "../../infra/auth-middleware";
import { getAdminDashboardService } from "../../services/admin/admin.dashboard.service";

export async function getAdminDashboardHandler(
    req: AuthenticatedRequest,
    res: Response
) {
    const data = await getAdminDashboardService();
    return res.status(200).json(data);
}
