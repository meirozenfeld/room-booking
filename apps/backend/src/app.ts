import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import { requestIdMiddleware } from "./infra/request-id";
import { errorMiddleware } from "./infra/error-middleware";
import { healthHandler } from "./infra/health";
import { requestLogger } from "./infra/request-logger";
import { authRateLimiter } from "./infra/rate-limit";
import { metricsMiddleware } from "./infra/observability/metrics-middleware";
import { metricsHandler } from "./infra/observability/metrics-route";
import { AppError } from "./infra/app-error";
import { checkReadiness } from "./infra/ready";
import pingRouter from "./api/ping.routes";
import authRouter from "./api/auth.routes";
import usersRouter from "./api/users.routes";
import adminRouter from "./api/admin/admin.routes";
import dashboardRoutes from "./api/dashboard.routes";
import roomsRouter from "./api/rooms.routes";
import bookingsRoutes from "./api/bookings.routes";


dotenv.config();

export const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173"],
        credentials: true,
    })
);
app.use(express.json());
app.options("/api/auth/*", cors());
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(metricsMiddleware);

app.get("/health", healthHandler);
app.get("/ready", async (_req, res) => {
    try {
        await checkReadiness();
        res.status(200).json({ status: "ready" });
    } catch (err) {
        res.status(503).json({ status: "not_ready" });
    }
});


app.get("/metrics", metricsHandler);

app.use("/api", pingRouter);
app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/rooms", roomsRouter);
app.use("/bookings", bookingsRoutes);


app.use((req, res) => {
    throw new AppError("Route not found", 404);
});

// Error handler
app.use(errorMiddleware);
