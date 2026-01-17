import User from '../../models/modules/User';
import { RegisterRequestBody } from '../../types/user';
interface AdditionalUserFields {
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}
export declare const registerUser: (username: string, email: string, password: string, additionalFields?: AdditionalUserFields) => Promise<User>;
export declare const loginUser: (identifier: string, password: string) => Promise<User>;
export declare const updateUser: (userId: number, updateData: Partial<RegisterRequestBody>) => Promise<User>;
export declare const deleteUser: (userId: number) => Promise<boolean>;
export declare const getUsers: (page?: number, limit?: number, keyword?: string, status?: "active" | "inactive" | "banned") => Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export {};
//# sourceMappingURL=userService.d.ts.map