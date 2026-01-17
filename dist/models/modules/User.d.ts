import { Model, Optional } from 'sequelize';
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    nickname?: string | null;
    avatar?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    birthday?: Date | null;
    phone?: string | null;
    status: 'active' | 'inactive' | 'banned';
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'nickname' | 'avatar' | 'gender' | 'birthday' | 'phone' | 'status' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> {
    toJSON(): Omit<UserAttributes, 'password'>;
}
export default User;
//# sourceMappingURL=User.d.ts.map