import { Context } from 'koa';
type Next = () => Promise<any>;
declare const jwtAuth: (ctx: Context, next: Next) => Promise<void>;
export default jwtAuth;
//# sourceMappingURL=jwtAuth.d.ts.map