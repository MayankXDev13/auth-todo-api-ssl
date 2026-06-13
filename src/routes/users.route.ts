import { Router } from "express";
import { listUsers, getUser, deleteUser } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  listUsersSchema,
  getUserSchema,
  deleteUserSchema,
} from "../schemas/user.schema.js";

const router = Router();

router.use(authenticate);
router.use(requireRole("admin"));

router.get("/", validate(listUsersSchema), listUsers);  
router.get("/:id", validate(getUserSchema), getUser);
router.delete("/:id", validate(deleteUserSchema), deleteUser);

export default router;