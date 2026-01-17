import { Context } from 'koa';
type Next = () => Promise<any>;
declare const requestLogger: (ctx: Context, next: Next) => Promise<void>;
export default requestLogger;
//# sourceMappingURL=requestLogger.d.ts.map