// 请求日志中间件
const requestLogger = async (ctx, next) => {
    const start = Date.now();
    const { method, url, ip } = ctx.request;
    
    // 记录请求开始
    console.log(`[Request] ${new Date().toISOString()} | ${method} ${url} | IP: ${ip}`);
    
    try {
        await next();
        
        // 记录请求结束
        const ms = Date.now() - start;
        console.log(`[Response] ${new Date().toISOString()} | ${method} ${url} | Status: ${ctx.status} | ${ms}ms`);
    } catch (error) {
        // 记录错误
        const ms = Date.now() - start;
        console.error(`[Error] ${new Date().toISOString()} | ${method} ${url} | Status: ${error.statusCode || 500} | ${ms}ms | Error: ${error.message}`);
        throw error;
    }
};

module.exports = requestLogger;
