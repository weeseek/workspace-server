export interface JwtPayload {
    userId: number;
    username: string;
    email: string;
    [key: string]: any;
}
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export declare const jwtConfig: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
};
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const generateTokens: (payload: JwtPayload) => Tokens;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map