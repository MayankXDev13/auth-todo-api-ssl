"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_js_1 = require("../controllers/users.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const role_middleware_js_1 = require("../middlewares/role.middleware.js");
const validate_js_1 = require("../middlewares/validate.js");
const user_schema_js_1 = require("../schemas/user.schema.js");
const router = (0, express_1.Router)();
// All user management routes require a valid JWT and admin role
router.use(auth_middleware_js_1.authenticate);
router.use((0, role_middleware_js_1.requireRole)("admin"));
// GET  /users          - paginated list with optional search
router.get("/", (0, validate_js_1.validate)(user_schema_js_1.listUsersSchema), users_controller_js_1.listUsers);
// GET  /users/:id      - get single user by UUID
router.get("/:id", (0, validate_js_1.validate)(user_schema_js_1.getUserSchema), users_controller_js_1.getUser);
// DELETE /users/:id    - delete user by UUID
router.delete("/:id", (0, validate_js_1.validate)(user_schema_js_1.deleteUserSchema), users_controller_js_1.deleteUser);
exports.default = router;
