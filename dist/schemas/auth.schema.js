"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = exports.loginBodySchema = exports.registerBodySchema = void 0;
const zod_1 = require("zod");
// ── Body schemas ──────────────────────────────────────────────────────────
exports.registerBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters long"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
});
exports.loginBodySchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(1, "Password is required"),
});
// ── Wrapped route schemas ─────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    body: exports.registerBodySchema,
});
exports.loginSchema = zod_1.z.object({
    body: exports.loginBodySchema,
});
