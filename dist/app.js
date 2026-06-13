"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const morgan_logger_js_1 = __importDefault(require("./logger/morgan.logger.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const users_route_js_1 = __importDefault(require("./routes/users.route.js"));
const todos_route_js_1 = __importDefault(require("./routes/todos.route.js"));
const notFound_middleware_js_1 = require("./middlewares/notFound.middleware.js");
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(morgan_logger_js_1.default);
    // Health check
    app.get("/health", (req, res) => {
        res.json({ ok: true, timestamp: new Date().toISOString() });
    });
    // API routes
    app.use("/auth", auth_routes_js_1.default);
    app.use("/users", users_route_js_1.default);
    app.use("/todos", todos_route_js_1.default);
    // 404 & error handling
    app.use(notFound_middleware_js_1.notFound);
    app.use(error_middleware_js_1.errorHandler);
    return app;
}
