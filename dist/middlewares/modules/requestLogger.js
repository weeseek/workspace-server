"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestLogger = async (ctx, next) => {
    const start = Date.now();
    const { method, url, ip } = ctx.request;
    console.log(`[Request] ${new Date().toISOString()} | ${method} ${url} | IP: ${ip}`);
    try {
        await next();
        const ms = Date.now() - start;
        console.log(`[Response] ${new Date().toISOString()} | ${method} ${url} | Status: ${ctx.status} | ${ms}ms`);
    }
    catch (error) {
        const ms = Date.now() - start;
        console.error(`[Error] ${new Date().toISOString()} | ${method} ${url} | Status: ${error.statusCode || 500} | ${ms}ms | Error: ${error.message}`);
        throw error;
    }
};
exports.default = requestLogger;
//# sourceMappingURL=requestLogger.js.map