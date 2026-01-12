import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import { requestIdMiddleware } from "./infra/request-id";
import { errorMiddleware } from "./infra/error-middleware";
import { healthHandler } from "./infra/health";
import pingRouter from "./api/ping.routes";
import { requestLogger } from "./infra/request-logger";
import authRouter from "./api/auth.routes";
import { authRateLimiter } from "./infra/rate-limit";
import usersRouter from "./api/users.routes";
import adminRouter from "./api/admin.routes";
import roomsRouter from "./api/rooms.routes";
import bookingsRoutes from "./api/routes/bookingsRoutes";
import { metricsMiddleware } from "./infra/observability/metrics-middleware";
import { metricsHandler } from "./infra/observability/metrics-route";
import { AppError } from "./infra/app-error";

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
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(metricsMiddleware);

// health
app.get("/health", healthHandler);
app.get("/metrics", metricsHandler);

app.use("/api", pingRouter);
app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/rooms", roomsRouter);
app.use("/bookings", bookingsRoutes);


app.use((req, res) => {
    throw new AppError("Route not found", 404);
});
// error handler – תמיד אחרון
app.use(errorMiddleware);
