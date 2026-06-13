import express, { type Express } from "express";
import morganMiddleware from "./logger/morgan.logger.js";
import logger from "./logger/winston.logger.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.route.js";
import todoRoutes from "./routes/todos.route.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(morganMiddleware);

  // Health check
  app.get("/health", (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/todos", todoRoutes);

  // 404 & error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
