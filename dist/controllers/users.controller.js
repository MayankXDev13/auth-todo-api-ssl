"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
const db_js_1 = require("../db/db.js");
const schema_js_1 = require("../db/schema.js");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * TODO: List all users (Admin only)
 *
 * 1. Find all users (password excluded by default)
 * 2. Return 200 with { users }
 */
async function listUsers(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const offset = (page - 1) * limit;
        let condition = undefined;
        if (search) {
            condition = (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_js_1.users.name, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_js_1.users.email, `%${search}%`));
        }
        const data = await db_js_1.db.select({
            id: schema_js_1.users.id,
            name: schema_js_1.users.name,
            email: schema_js_1.users.email,
            role: schema_js_1.users.role,
            emailVerified: schema_js_1.users.emailVerified,
            createdAt: schema_js_1.users.createdAt,
            updatedAt: schema_js_1.users.updatedAt
        }).from(schema_js_1.users)
            .where(condition)
            .limit(limit)
            .offset(offset);
        const totalResult = await db_js_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_js_1.users).where(condition);
        const total = totalResult[0].count;
        res.status(200).json({
            users: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * TODO: Get user by ID (Admin only)
 *
 * 1. Extract id from req.params
 * 2. Find user by id (password excluded by default)
 * 3. If not found: return 404 with { error: { message: "User not found" } }
 * 4. Return 200 with { user }
 */
async function getUser(req, res, next) {
    try {
        const id = req.params.id;
        const userResult = await db_js_1.db.select({
            id: schema_js_1.users.id,
            name: schema_js_1.users.name,
            email: schema_js_1.users.email,
            role: schema_js_1.users.role,
            emailVerified: schema_js_1.users.emailVerified,
            createdAt: schema_js_1.users.createdAt,
            updatedAt: schema_js_1.users.updatedAt
        }).from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, id)).limit(1);
        const user = userResult[0];
        if (!user) {
            return res.status(404).json({ error: { message: "User not found" } });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
}
/**
 * TODO: Delete user (Admin only)
 *
 * 1. Extract id from req.params
 * 2. Delete user by id
 * 3. If not found: return 404 with { error: { message: "User not found" } }
 * 4. Return 200 with { message: "User deleted successfully" }
 */
async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        const result = await db_js_1.db.delete(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, id)).returning();
        if (result.length === 0) {
            return res.status(404).json({ error: { message: "User not found" } });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
