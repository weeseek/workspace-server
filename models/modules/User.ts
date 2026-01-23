import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

// 定义User属性接口
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
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}

// 定义创建User时的可选属性
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'nickname' | 'avatar' | 'gender' | 'birthday' | 'phone' | 'status' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {}

// 创建User模型
class User extends Model<UserAttributes, UserCreationAttributes> {
    // 注意：根据Sequelize警告，不要声明public class fields，它们会遮蔽Sequelize的属性getters

    // 在模型原型上定义toJSON方法，用于自定义JSON序列化
    public toJSON(): Omit<UserAttributes, 'password'> {
        const values = this.get() as UserAttributes;
        
        // 使用对象解构排除敏感字段，而不是直接删除
        const { password, ...result } = values;
        
        return result;
    }
}

// 初始化模型
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
            isUrl: true
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
            isIn: [['male', 'female', 'other', null]]
        }
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null,
        validate: {
            isNumeric: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'inactive', 'banned']]
        }
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    tenantId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tenant ID cannot be empty'
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'Users',
    timestamps: true
});

export default User;