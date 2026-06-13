"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const validate_js_1 = require("../middlewares/validate.js");
const auth_schema_js_1 = require("../schemas/auth.schema.js");
const router = (0, express_1.Router)();
// POST /auth/register
router.post("/register", (0, validate_js_1.validate)(auth_schema_js_1.registerSchema), auth_controller_js_1.register);
// POST /auth/login
router.post("/login", (0, validate_js_1.validate)(auth_schema_js_1.loginSchema), auth_controller_js_1.login);
// GET /auth/me  (protected)
router.get("/me", auth_middleware_js_1.authenticate, auth_controller_js_1.me);
exports.default = router;
