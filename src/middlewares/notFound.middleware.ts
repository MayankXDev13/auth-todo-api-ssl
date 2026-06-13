import { Request, Response } from "express";

/**
 * TODO: Handle 404 errors
 *
 * Return 404 with { error: { message: "Route not found" } }
 */
export function notFound(req: Request, res: Response) {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}