import { Context } from 'koa';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    status: string;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
}
export declare const handleError: (err: Error, ctx: Context) => void;
export declare const handleSequelizeError: (err: any) => Error | AppError;
//# sourceMappingURL=errorHandler.d.ts.map