import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    refreshToken: text("refresh_token"),
    forgotPasswordToken: text("forgot_password_token"),
    forgotPasswordTokenExpiry: timestamp("forgot_password_token_expiry"),
    emailVerificationToken: text("email_verification_token"),
    emailVerificationTokenExpiry: timestamp("email_verification_token_expiry"),
    emailVerified: boolean("email_verified").default(false),
    role: roleEnum("role").default("user"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("email_idx").on(t.email),
    index("refresh_token_idx").on(t.refreshToken),
    index("forgot_password_token_idx").on(t.forgotPasswordToken),
    index("forgot_password_token_expiry_idx").on(t.forgotPasswordTokenExpiry),
    index("role_idx").on(t.role),
  ],
);

export const statusEnum = pgEnum("status", ["pending", "completed"]);
export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const todos = pgTable(
  "todos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").references(() => users.id, {
      onDelete: "cascade",
    }),
    title: text("title").notNull(),
    description: text("description"),
    status: statusEnum("status").notNull().default("pending"),
    priority: priorityEnum("priority").notNull().default("medium"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (t) => [
    index("userId_idx").on(t.userId),
    index("title_idx").on(t.title),
    index("status_idx").on(t.status),
    index("priority_idx").on(t.priority),
    index("dueDate_idx").on(t.dueDate),
  ],
);

// 1 to n to users
export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

// n to 1 to todos
export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));
