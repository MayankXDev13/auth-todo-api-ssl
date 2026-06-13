"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todosRelations = exports.usersRelations = exports.todos = exports.priorityEnum = exports.statusEnum = exports.users = exports.roleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleEnum = (0, pg_core_1.pgEnum)("role", ["user", "admin"]);
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").unique().notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    forgotPasswordToken: (0, pg_core_1.text)("forgot_password_token"),
    forgotPasswordTokenExpiry: (0, pg_core_1.timestamp)("forgot_password_token_expiry"),
    emailVerificationToken: (0, pg_core_1.text)("email_verification_token"),
    emailVerificationTokenExpiry: (0, pg_core_1.timestamp)("email_verification_token_expiry"),
    emailVerified: (0, pg_core_1.boolean)("email_verified").default(false),
    role: (0, exports.roleEnum)("role").default("user"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (t) => [
    (0, pg_core_1.index)("email_idx").on(t.email),
    (0, pg_core_1.index)("refresh_token_idx").on(t.refreshToken),
    (0, pg_core_1.index)("forgot_password_token_idx").on(t.forgotPasswordToken),
    (0, pg_core_1.index)("forgot_password_token_expiry_idx").on(t.forgotPasswordTokenExpiry),
    (0, pg_core_1.index)("role_idx").on(t.role),
]);
exports.statusEnum = (0, pg_core_1.pgEnum)("status", ["pending", "completed"]);
exports.priorityEnum = (0, pg_core_1.pgEnum)("priority", ["high", "medium", "low"]);
exports.todos = (0, pg_core_1.pgTable)("todos", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)("userId").references(() => exports.users.id, {
        onDelete: "cascade",
    }),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    status: (0, exports.statusEnum)("status").notNull().default("pending"),
    priority: (0, exports.priorityEnum)("priority").notNull().default("medium"),
    dueDate: (0, pg_core_1.timestamp)("due_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at"),
}, (t) => [
    (0, pg_core_1.index)("userId_idx").on(t.userId),
    (0, pg_core_1.index)("title_idx").on(t.title),
    (0, pg_core_1.index)("status_idx").on(t.status),
    (0, pg_core_1.index)("priority_idx").on(t.priority),
    (0, pg_core_1.index)("dueDate_idx").on(t.dueDate),
]);
// 1 to n to users
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    todos: many(exports.todos),
}));
// n to 1 to todos
exports.todosRelations = (0, drizzle_orm_1.relations)(exports.todos, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.todos.userId],
        references: [exports.users.id],
    }),
}));
