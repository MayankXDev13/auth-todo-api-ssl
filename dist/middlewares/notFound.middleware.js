"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
/**
 * TODO: Handle 404 errors
 *
 * Return 404 with { error: { message: "Route not found" } }
 */
function notFound(req, res) {
    res.status(404).json({
        error: { message: `Route ${req.method} ${req.originalUrl} not found` },
    });
}
