import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

/**
 * TODO: Authenticate user using JWT
 *
 * 1. Extract Authorization header from req.headers.authorization
 * 2. Check if header exists and starts with "Bearer "
 *    - If not: return 401 with { error: { message: "No token provided" } }
 * 3. Extract token (split by space and get second part)
 * 4. Verify token using verifyToken(token) - wrap in try/catch
 *    - If invalid: return 401 with { error: { message: "Invalid token" } }
 * 5. Find user by decoded.userId
 *    - If not found: return 401 with { error: { message: "Invalid token" } }
 * 6. Attach user to req.user
 * 7. Call next()
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: { message: "No token provided" } });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as any;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: { message: "Invalid token" } });
    }

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);
    const user = userResult[0];

    if (!user) {
      return res.status(401).json({ error: { message: "Invalid token" } });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
}
