"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_js_1 = require("../db/db.js");
const schema_js_1 = require("../db/schema.js");
const jwt_js_1 = require("../utils/jwt.js");
const drizzle_orm_1 = require("drizzle-orm");
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await db_js_1.db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: { message: "User already exists" } });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [user] = await db_js_1.db.insert(schema_js_1.users).values({
            name,
            email,
            password: hashedPassword
        }).returning();
        const token = (0, jwt_js_1.signToken)({ userId: user.id });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const userResult = await db_js_1.db.select().from(schema_js_1.users).where((0, drizzle_orm_1.eq)(schema_js_1.users.email, email)).limit(1);
        const user = userResult[0];
        if (!user) {
            return res.status(401).json({ error: { message: "Invalid credentials" } });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: { message: "Invalid credentials" } });
        }
        const token = (0, jwt_js_1.signToken)({ userId: user.id });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    }
    catch (error) {
        next(error);
    }
}
async function me(req, res, next) {
    try {
        // @ts-ignore
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: { message: "User not found" } });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    }
    catch (error) {
        next(error);
    }
}
