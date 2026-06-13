import { z } from "zod";

const todoStatus = z.enum(["pending", "completed"]);
const todoPriority = z.enum(["high", "medium", "low"]);
const uuidParam = z.string().uuid("Invalid UUID");

export const createTodoBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: todoStatus.optional(),
  priority: todoPriority.optional(),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO 8601 datetime" })
    .optional()
    .nullable(),
});

export const updateTodoBodySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .optional(),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),
  status: todoStatus.optional(),
  priority: todoPriority.optional(),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO 8601 datetime" })
    .optional()
    .nullable(),
});

export const todoIdParamSchema = z.object({
  id: uuidParam,
});

export const listTodosQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1, "page must be >= 1")),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100, "limit must be <= 100")),
  title: z.string().optional(),
});

export const createTodoSchema = z.object({
  body: createTodoBodySchema,
});

export const updateTodoSchema = z.object({
  body: updateTodoBodySchema,
  params: todoIdParamSchema,
});

export const getTodoSchema = z.object({
  params: todoIdParamSchema,
});

export const deleteTodoSchema = z.object({
  params: todoIdParamSchema,
});

export const listTodosSchema = z.object({
  query: listTodosQuerySchema,
});
