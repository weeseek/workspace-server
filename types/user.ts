/**
 * 用户相关类型定义
 */

// 定义注册请求体接口
export interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}

// 定义登录请求体接口
export interface LoginRequestBody {
    email?: string;
    username?: string;
    password: string;
}

// 定义用户更新请求体接口
export interface UpdateUserRequestBody {
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
}

// 定义用户查询参数接口
export interface UserQueryParams {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: 'active' | 'inactive' | 'banned';
}
