"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.getUserSchema = exports.listUsersSchema = exports.userIdParamSchema = exports.listUsersQuerySchema = void 0;
const zod_1 = require("zod");
// ── Reusable ──────────────────────────────────────────────────────────────
const uuidParam = zod_1.z.string().uuid("Invalid UUID");
// ── Query schemas ─────────────────────────────────────────────────────────
exports.listUsersQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 1))
        .pipe(zod_1.z.number().int().min(1, "page must be >= 1")),
    limit: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : 10))
        .pipe(zod_1.z.number().int().min(1).max(100, "limit must be <= 100")),
    search: zod_1.z.string().optional(),
});
// ── Param schemas ─────────────────────────────────────────────────────────
exports.userIdParamSchema = zod_1.z.object({
    id: uuidParam,
});
// ── Wrapped route schemas ─────────────────────────────────────────────────
exports.listUsersSchema = zod_1.z.object({
    query: exports.listUsersQuerySchema,
});
exports.getUserSchema = zod_1.z.object({
    params: exports.userIdParamSchema,
});
exports.deleteUserSchema = zod_1.z.object({
    params: exports.userIdParamSchema,
});
