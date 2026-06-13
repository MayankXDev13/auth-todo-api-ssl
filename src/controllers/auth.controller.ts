import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { signToken } from "../utils/jwt.js";
import { eq } from "drizzle-orm";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body as any;

    const [existingUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,

      })
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return res
        .status(400)
        .json({ error: { message: "User already exists" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,

      });

    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as any;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    const token = signToken({ userId: user.id });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }
    res.json({ user: user });
  } catch (error) {
    next(error);
  }
}
