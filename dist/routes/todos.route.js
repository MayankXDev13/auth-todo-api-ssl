"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const validate_js_1 = require("../middlewares/validate.js");
const todo_controller_js_1 = require("../controllers/todo.controller.js");
const todo_schema_js_1 = require("../schemas/todo.schema.js");
const router = (0, express_1.Router)();
// All todo routes require authentication
router.use(auth_middleware_js_1.authenticate);
// GET  /todos          - list with pagination + optional title search
router.get("/", (0, validate_js_1.validate)(todo_schema_js_1.listTodosSchema), todo_controller_js_1.listTodos);
// GET  /todos/:id      - get single todo by UUID
router.get("/:id", (0, validate_js_1.validate)(todo_schema_js_1.getTodoSchema), todo_controller_js_1.getTodo);
// POST /todos          - create a new todo
router.post("/", (0, validate_js_1.validate)(todo_schema_js_1.createTodoSchema), todo_controller_js_1.createTodo);
// PATCH /todos/:id     - partial update
router.patch("/:id", (0, validate_js_1.validate)(todo_schema_js_1.updateTodoSchema), todo_controller_js_1.updateTodo);
// DELETE /todos/:id    - delete a todo
router.delete("/:id", (0, validate_js_1.validate)(todo_schema_js_1.deleteTodoSchema), todo_controller_js_1.deleteTodo);
exports.default = router;
