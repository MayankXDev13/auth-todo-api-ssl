"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_js_1 = require("../utils/jwt.js");
const db_js_1 = require("../db/db.js");
const schema_js_1 = require("../db/schema.js");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * TODO: Authenticate user using JWT
 *
 * 1. Extract Authorization header from req.headers.authorization
 * 2. Check if header exists and starts with "Bearer "
 *    - If not: return 401 with { error: { message: "No token provided" } }
 * 3. Extract token (split by space and get second part)
 * 4. Verify token using verifyToken(token) - wrap in try/catch
 *    - If invalid: return 401 with { error: { message: "Invalid token" } }
 * 5. Find user by decoded.userId
 *    - If not found: return 401 with { error: { message: "Invalid token" } }
 * 6. Attach user to req.user
 * 7. Call next()
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: { message: "No token provided" } });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_js_1.verifyToken)(token);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: { message: "Invalid token" } });
        }
        const userResult = await db_js_1.db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.id, decoded.userId)).limit(1);
        const user = userResult[0];
        if (!user) {
            return res.status(401).json({ error: { message: "Invalid token" } });
        }
        // @ts-ignore
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: { message: "Invalid token" } });
    }
}
