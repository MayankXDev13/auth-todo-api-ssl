"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTodosSchema = exports.deleteTodoSchema = exports.getTodoSchema = exports.updateTodoSchema = exports.createTodoSchema = exports.listTodosQuerySchema = exports.todoIdParamSchema = exports.updateTodoBodySchema = exports.createTodoBodySchema = void 0;
const zod_1 = require("zod");
// ── Reusable field validators ──────────────────────────────────────────────
const todoStatus = zod_1.z.enum(["pending", "completed"]);
const todoPriority = zod_1.z.enum(["high", "medium", "low"]);
const uuidParam = zod_1.z.string().uuid("Invalid UUID");
// ── Body schemas ──────────────────────────────────────────────────────────
exports.createTodoBodySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: zod_1.z.string().max(1000, "Description is too long").optional(),
    status: todoStatus.optional(),
    priority: todoPriority.optional(),
    dueDate: zod_1.z
        .string()
        .datetime({ message: "dueDate must be a valid ISO 8601 datetime" })
        .optional()
        .nullable(),
});
exports.updateTodoBodySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title is too long")
        .optional(),
    description: zod_1.z.string().max(1000, "Description is too long").optional().nullable(),
    status: todoStatus.optional(),
    priority: todoPriority.optional(),
    dueDate: zod_1.z
        .string()
        .datetime({ message: "dueDate must be a valid ISO 8601 datetime" })
        .optional()
        .nullable(),
});
// ── Param schemas ─────────────────────────────────────────────────────────
exports.todoIdParamSchema = zod_1.z.object({
    id: uuidParam,
});
// ── Query schemas ─────────────────────────────────────────────────────────
exports.listTodosQuerySchema = zod_1.z.object({
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
    title: zod_1.z.string().optional(),
});
// ── Wrapped route schemas (body + params + query envelope) ────────────────
exports.createTodoSchema = zod_1.z.object({
    body: exports.createTodoBodySchema,
});
exports.updateTodoSchema = zod_1.z.object({
    body: exports.updateTodoBodySchema,
    params: exports.todoIdParamSchema,
});
exports.getTodoSchema = zod_1.z.object({
    params: exports.todoIdParamSchema,
});
exports.deleteTodoSchema = zod_1.z.object({
    params: exports.todoIdParamSchema,
});
exports.listTodosSchema = zod_1.z.object({
    query: exports.listTodosQuerySchema,
});
