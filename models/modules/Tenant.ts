import { DataTypes, Model, Optional } from 'sequelize';
import { TenantStatus, DbType } from '../../types/tenant';
import { MultiTenantDbManager } from '../../config/multiTenantDbManager';

// 定义Tenant属性接口
interface TenantAttributes {
    tenantId: string;
    name: string;
    status: TenantStatus;
    dbConfig: any;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 定义创建Tenant时的可选属性
interface TenantCreationAttributes extends Optional<TenantAttributes, 'status' | 'description' | 'createdAt' | 'updatedAt'> {}

// 创建Tenant模型
class Tenant extends Model<TenantAttributes, TenantCreationAttributes> {
    // 显式声明模型属性，确保TypeScript编译器能识别它们
    public tenantId!: string;
    public name!: string;
    public status!: TenantStatus;
    public dbConfig!: any;
    public description?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    
    // 在模型原型上定义toJSON方法，用于自定义JSON序列化
    public toJSON(): Omit<TenantAttributes, 'createdAt' | 'updatedAt'> {
        const values = this.get() as TenantAttributes;
        
        // 使用对象解构排除敏感字段，而不是直接删除
        const { createdAt, updatedAt, ...result } = values;
        
        return result;
    }
}

// 初始化模型，使用主数据库连接
Tenant.init({
    tenantId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tenant ID cannot be empty'
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tenant name cannot be empty'
            },
            len: {
                args: [1, 50],
                msg: 'Tenant name must be between 1 and 50 characters'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: TenantStatus.ACTIVE,
        validate: {
            isIn: {
                args: [[TenantStatus.ACTIVE, TenantStatus.INACTIVE]],
                msg: 'Tenant status must be either active or inactive'
            }
        }
    },
    dbConfig: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Database configuration cannot be empty'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
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
    sequelize: MultiTenantDbManager.getMainConnection(),
    tableName: 'Tenants',
    timestamps: true,
    modelName: 'Tenant'
});

export default Tenant;
