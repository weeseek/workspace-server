import User from '../../models/modules/User';
interface AdditionalUserFields {
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}
export declare const registerUser: (username: string, email: string, password: string, additionalFields?: AdditionalUserFields) => Promise<User>;
export declare const loginUser: (email: string, password: string) => Promise<User>;
export {};
//# sourceMappingURL=userService.d.ts.map