import { NextFunction, Request, Response } from "express";
import logger from "../logger/winston.logger.js";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(error);

  // PostgreSQL unique constraint violation
  if (error.code === "23505") {
    return res.status(409).json({ error: { message: "Email already exists" } });
  }

  // Zod validation errors (if thrown manually)
  if (error.name === "ZodError") {
    return res.status(400).json({ error: { message: error.message, issues: error.issues } });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({ error: { message: "Invalid or expired token" } });
  }

  // Generic error fallback
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({ error: { message } });
}
