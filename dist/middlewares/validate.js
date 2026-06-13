"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Validation middleware factory.
 *
 * The schema should be a z.object({ body?, params?, query? }) that validates
 * the corresponding parts of the request.
 *
 * Example:
 *   validate(z.object({ body: createTodoBodySchema }))
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (!result.success) {
        return res.status(400).json({
            error: {
                message: "Validation failed",
                issues: result.error.format(),
            },
        });
    }
    // Merge validated data back into req so controllers receive clean types
    const data = result.data;
    if (data["body"] !== undefined)
        req.body = data["body"];
    if (data["params"] !== undefined)
        Object.assign(req.params, data["params"]);
    if (data["query"] !== undefined)
        Object.assign(req.query, data["query"]);
    next();
};
exports.validate = validate;
