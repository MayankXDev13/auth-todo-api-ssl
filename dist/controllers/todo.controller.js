"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTodos = listTodos;
exports.getTodo = getTodo;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
const db_js_1 = require("../db/db.js");
const schema_js_1 = require("../db/schema.js");
const drizzle_orm_1 = require("drizzle-orm");
async function listTodos(req, res, next) {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const title = req.query.title;
        const offset = (page - 1) * limit;
        let condition = (0, drizzle_orm_1.eq)(schema_js_1.todos.userId, userId);
        if (title) {
            condition = (0, drizzle_orm_1.and)(condition, (0, drizzle_orm_1.ilike)(schema_js_1.todos.title, `%${title}%`));
        }
        const data = await db_js_1.db.select().from(schema_js_1.todos)
            .where(condition)
            .limit(limit)
            .offset(offset);
        const totalResult = await db_js_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_js_1.todos).where(condition);
        const total = totalResult[0].count;
        res.status(200).json({
            todos: data,
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
async function getTodo(req, res, next) {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id;
        const result = await db_js_1.db.select().from(schema_js_1.todos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.todos.id, id), (0, drizzle_orm_1.eq)(schema_js_1.todos.userId, userId))).limit(1);
        const todo = result[0];
        if (!todo) {
            return res.status(404).json({ error: { message: "Todo not found" } });
        }
        res.status(200).json({ todo });
    }
    catch (error) {
        next(error);
    }
}
async function createTodo(req, res, next) {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { title, description, status, priority, dueDate } = req.body;
        const [todo] = await db_js_1.db.insert(schema_js_1.todos).values({
            userId,
            title,
            description,
            status: status || "pending",
            priority: priority || "medium",
            dueDate: dueDate ? new Date(dueDate) : null
        }).returning();
        res.status(201).json({ todo });
    }
    catch (error) {
        next(error);
    }
}
async function updateTodo(req, res, next) {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id;
        const { title, description, status, priority, dueDate } = req.body;
        const [todo] = await db_js_1.db.update(schema_js_1.todos).set({
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            updatedAt: new Date()
        }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.todos.id, id), (0, drizzle_orm_1.eq)(schema_js_1.todos.userId, userId))).returning();
        if (!todo) {
            return res.status(404).json({ error: { message: "Todo not found" } });
        }
        res.status(200).json({ todo });
    }
    catch (error) {
        next(error);
    }
}
async function deleteTodo(req, res, next) {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id;
        const result = await db_js_1.db.delete(schema_js_1.todos).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_js_1.todos.id, id), (0, drizzle_orm_1.eq)(schema_js_1.todos.userId, userId))).returning();
        if (result.length === 0) {
            return res.status(404).json({ error: { message: "Todo not found" } });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
