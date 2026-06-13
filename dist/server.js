"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_js_1 = require("./app.js");
const winston_logger_js_1 = __importDefault(require("./logger/winston.logger.js"));
async function start() {
    try {
        const port = process.env.PORT || "3000";
        const app = (0, app_js_1.createApp)();
        app.listen(port, () => {
            winston_logger_js_1.default.info(`Server running on port ${port}`);
        });
    }
    catch (error) {
        winston_logger_js_1.default.error("Failed to start server:", error);
        process.exit(1);
    }
}
start();
