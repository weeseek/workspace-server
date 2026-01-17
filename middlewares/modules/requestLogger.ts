// 请求日志中间件
import { Context } from 'koa';

// 定义Next类型
type Next = () => Promise<any>;

const requestLogger = async (ctx: Context, next: Next): Promise<void> => {
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
        console.error(`[Error] ${new Date().toISOString()} | ${method} ${url} | Status: ${(error as any).statusCode || 500} | ${ms}ms | Error: ${(error as Error).message}`);
        throw error;
    }
};

export default requestLogger;