import { Context } from 'koa';

// 定义统一响应格式接口
export interface ApiResponse {
    code: number;
    message: string;
    data: any;
}

/**
 * 统一响应格式
 * @param {Context} ctx - Koa上下文对象
 * @param {number} statusCode - HTTP状态码
 * @param {number} code - 业务状态码
 * @param {string} message - 响应消息
 * @param {any} data - 响应数据
 */
export const sendResponse = (ctx: Context, statusCode: number, code: number, message: string, data: any = null): void => {
    ctx.status = statusCode;
    ctx.body = {
        code,
        message,
        data
    } as ApiResponse;
};

/**
 * 成功响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 * @param {any} data - 响应数据
 */
export const sendSuccess = (ctx: Context, message: string, data: any = null): void => {
    sendResponse(ctx, 200, 0, message, data);
};

/**
 * 成功创建响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 * @param {any} data - 响应数据
 */
export const sendCreated = (ctx: Context, message: string, data: any = null): void => {
    sendResponse(ctx, 201, 0, message, data);
};

/**
 * 客户端错误响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 * @param {number} code - 业务状态码，默认400
 */
export const sendClientError = (ctx: Context, message: string, code: number = 400): void => {
    sendResponse(ctx, 400, code, message);
};

/**
 * 未授权响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 */
export const sendUnauthorized = (ctx: Context, message: string = 'Unauthorized'): void => {
    sendResponse(ctx, 401, 401, message);
};

/**
 * 权限不足响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 */
export const sendForbidden = (ctx: Context, message: string = 'Forbidden'): void => {
    sendResponse(ctx, 403, 403, message);
};

/**
 * 资源不存在响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 */
export const sendNotFound = (ctx: Context, message: string = 'Resource not found'): void => {
    sendResponse(ctx, 404, 404, message);
};

/**
 * 服务器错误响应
 * @param {Context} ctx - Koa上下文对象
 * @param {string} message - 响应消息
 */
export const sendServerError = (ctx: Context, message: string = 'Internal server error'): void => {
    sendResponse(ctx, 500, 500, message);
};
