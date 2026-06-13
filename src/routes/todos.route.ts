import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import {
  listTodosSchema,
  getTodoSchema,
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
} from "../schemas/todo.schema.js";

const router: Router = Router();


router.use(authenticate);

router.get("/", validate(listTodosSchema), listTodos);
router.get("/:id", validate(getTodoSchema), getTodo);
router.post("/", validate(createTodoSchema), createTodo);
router.patch("/:id", validate(updateTodoSchema), updateTodo);
router.delete("/:id", validate(deleteTodoSchema), deleteTodo);

export default router;