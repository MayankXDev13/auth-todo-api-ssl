import { z } from "zod";

// ── Body schemas ──────────────────────────────────────────────────────────

export const registerBodySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),
});

export const loginBodySchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ── Wrapped route schemas ─────────────────────────────────────────────────

export const registerSchema = z.object({
  body: registerBodySchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
});
