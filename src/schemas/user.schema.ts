import { z } from "zod";


const uuidParam = z.string().uuid("Invalid UUID");



export const listUsersQuerySchema = z.object({
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
  search: z.string().optional(),
});


export const userIdParamSchema = z.object({
  id: uuidParam,
});


export const listUsersSchema = z.object({
  query: listUsersQuerySchema,
});

export const getUserSchema = z.object({
  params: userIdParamSchema,
});

export const deleteUserSchema = z.object({
  params: userIdParamSchema,
});
