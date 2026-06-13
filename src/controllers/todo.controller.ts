import { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";
import { todos } from "../db/schema.js";
import { eq, and, ilike, count } from "drizzle-orm";

export async function listTodos(req: Request, res: Response, next: NextFunction) {
  try {
 
    const userId = req.user.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const title = req.query.title as string;

    const offset = (page - 1) * limit;

    let condition = eq(todos.userId, userId);
    if (title) {
      condition = and(condition, ilike(todos.title, `%${title}%`)) as any;
    }

    const data = await db.select().from(todos)
      .where(condition)
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select({ count: count() }).from(todos).where(condition);
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
  } catch (error) {
    next(error);
  }
}

export async function getTodo(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user.id as string;
    const id = req.params.id as string;

    const result = await db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).limit(1);
    const todo = result[0];

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user.id as string;
    const { title, description, status, priority, dueDate } = req.body as any;

    const [todo] = await db.insert(todos).values({
      userId,
      title,
      description,
      status: status || "pending",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null
    }).returning();

    res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user.id as string;
    const id = req.params.id as string;
    const { title, description, status, priority, dueDate } = req.body as any;

    const [todo] = await db.update(todos).set({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      updatedAt: new Date()
    }).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning();

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user.id as string;
    const id = req.params.id as string;

    const result = await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId))).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
}
