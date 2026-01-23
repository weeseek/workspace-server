import { Sequelize } from 'sequelize';
import { MultiTenantDbManager } from '../config/multiTenantDbManager';

// 导入模型类（注意：这里只导入类，不导入实例）
import { DataTypes, Model, Optional } from 'sequelize';
import { MenuType } from '../types/menu';

// 模型定义接口
interface ModelDefinition {
    name: string;
    define: (sequelize: Sequelize) => any;
}

/**
 * 模型工厂类
 * 用于管理不同租户的模型实例
 */
export class ModelFactory {
    // 存储每个租户的模型实例
    private static tenantModels: Map<string, Map<string, any>> = new Map();
    
    // 定义所有业务模型
    private static modelDefinitions: ModelDefinition[] = [
        {
            name: 'Menu',
            define: (sequelize: Sequelize) => {
                // 定义Menu属性接口
                interface MenuAttributes {
                    id: number;
                    tenantId: string;
                    appId: string;
                    name: string;
                    type: MenuType;
                    parentId: number | null;
                    path: string;
                    icon?: string;
                    order: number;
                    status: 'active' | 'inactive';
                    hidden: boolean;
                    permission?: string;
                    description?: string;
                    createdAt: Date;
                    updatedAt: Date;
                    children?: MenuAttributes[];
                }
                
                // 定义创建Menu时的可选属性
                interface MenuCreationAttributes extends Optional<MenuAttributes, 'id' | 'icon' | 'order' | 'status' | 'hidden' | 'permission' | 'description' | 'createdAt' | 'updatedAt'> {}
                
                // 创建Menu模型
                class Menu extends Model<MenuAttributes, MenuCreationAttributes> {
                    // 在模型原型上定义toJSON方法，用于自定义JSON序列化
                    public toJSON(): Omit<MenuAttributes, 'createdAt' | 'updatedAt'> & { children?: Omit<MenuAttributes, 'createdAt' | 'updatedAt'>[] } {
                        const values = this.get() as MenuAttributes;
                        
                        // 使用对象解构排除敏感字段，而不是直接删除
                        const { createdAt, updatedAt, ...result } = values;
                        
                        return result as Omit<MenuAttributes, 'createdAt' | 'updatedAt'> & { children?: Omit<MenuAttributes, 'createdAt' | 'updatedAt'>[] };
                    }
                }
                
                // 初始化模型
                Menu.init({
                    id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true
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
                    appId: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            notEmpty: {
                                msg: 'App ID cannot be empty'
                            }
                        }
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            notEmpty: {
                                msg: 'Menu name cannot be empty'
                            },
                            len: {
                                args: [1, 50],
                                msg: 'Menu name must be between 1 and 50 characters'
                            }
                        }
                    },
                    type: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            isIn: {
                                args: [[MenuType.NODE, MenuType.PAGE, MenuType.LINK]],
                                msg: 'Menu type must be either node, page, or link'
                            }
                        }
                    },
                    parentId: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                        references: {
                            model: 'Menus',
                            key: 'id'
                        },
                        onDelete: 'CASCADE'
                    },
                    path: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            notEmpty: {
                                msg: 'Menu path cannot be empty'
                            }
                        }
                    },
                    icon: {
                        type: DataTypes.STRING,
                        allowNull: true
                    },
                    order: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0
                    },
                    status: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        defaultValue: 'active',
                        validate: {
                            isIn: {
                                args: [['active', 'inactive']],
                                msg: 'Menu status must be either active or inactive'
                            }
                        }
                    },
                    hidden: {
                        type: DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: false
                    },
                    permission: {
                        type: DataTypes.STRING,
                        allowNull: true
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
                    sequelize,
                    tableName: 'Menus',
                    timestamps: true
                });
                
                // 定义父子菜单关系
                Menu.hasMany(Menu, {
                    as: 'children',
                    foreignKey: 'parentId',
                    onDelete: 'CASCADE'
                });
                
                Menu.belongsTo(Menu, {
                    as: 'parent',
                    foreignKey: 'parentId'
                });
                
                return Menu;
            }
        },
        {
            name: 'User',
            define: (sequelize: Sequelize) => {
                // 定义User属性接口
                interface UserAttributes {
                    id: number;
                    username: string;
                    email: string;
                    password: string;
                    role: 'admin' | 'user';
                    status: 'active' | 'inactive';
                    tenantId: string;
                    createdAt: Date;
                    updatedAt: Date;
                }
                
                // 定义创建User时的可选属性
                interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt'> {}
                
                // 创建User模型
                class User extends Model<UserAttributes, UserCreationAttributes> {
                    // 在模型原型上定义toJSON方法，用于自定义JSON序列化
                    public toJSON(): Omit<UserAttributes, 'password' | 'createdAt' | 'updatedAt'> {
                        const values = this.get() as UserAttributes;
                        
                        // 使用对象解构排除敏感字段，而不是直接删除
                        const { password, createdAt, updatedAt, ...result } = values;
                        
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
                        unique: true,
                        validate: {
                            notEmpty: {
                                msg: 'Username cannot be empty'
                            },
                            len: {
                                args: [3, 30],
                                msg: 'Username must be between 3 and 30 characters'
                            }
                        }
                    },
                    email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                        validate: {
                            notEmpty: {
                                msg: 'Email cannot be empty'
                            },
                            isEmail: {
                                msg: 'Invalid email format'
                            }
                        }
                    },
                    password: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            notEmpty: {
                                msg: 'Password cannot be empty'
                            },
                            len: {
                                args: [6, 100],
                                msg: 'Password must be between 6 and 100 characters'
                            }
                        }
                    },
                    role: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        defaultValue: 'user',
                        validate: {
                            isIn: {
                                args: [['admin', 'user']],
                                msg: 'Role must be either admin or user'
                            }
                        }
                    },
                    status: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        defaultValue: 'active',
                        validate: {
                            isIn: {
                                args: [['active', 'inactive']],
                                msg: 'Status must be either active or inactive'
                            }
                        }
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
                
                return User;
            }
        }
    ];
    
    /**
     * 初始化租户的所有模型
     * @param {string} tenantId - 租户ID
     */
    public static async initTenantModels(tenantId: string): Promise<void> {
        // 获取租户的数据库连接
        const sequelize = MultiTenantDbManager.getTenantConnection(tenantId);
        
        if (!sequelize) {
            throw new Error(`No database connection found for tenant: ${tenantId}`);
        }
        
        // 为租户创建模型映射
        const models = new Map<string, any>();
        
        // 定义所有模型
        for (const modelDef of this.modelDefinitions) {
            const model = modelDef.define(sequelize);
            models.set(modelDef.name, model);
        }
        
        // 存储租户模型
        this.tenantModels.set(tenantId, models);
        
        // 同步模型到数据库
        await sequelize.sync();
    }
    
    /**
     * 获取租户的模型实例
     * @param {string} tenantId - 租户ID
     * @param {string} modelName - 模型名称
     * @returns {any} 模型实例
     */
    public static getTenantModel(tenantId: string, modelName: string): any {
        // 获取租户的模型映射
        const models = this.tenantModels.get(tenantId);
        
        if (!models) {
            throw new Error(`Models not initialized for tenant: ${tenantId}`);
        }
        
        // 获取模型实例
        const model = models.get(modelName);
        
        if (!model) {
            throw new Error(`Model ${modelName} not found for tenant: ${tenantId}`);
        }
        
        return model;
    }
    
    /**
     * 初始化所有活跃租户的模型
     */
    public static async initAllTenantModels(): Promise<void> {
        // 获取所有活跃租户
        const Tenant = require('./modules/Tenant').default;
        const tenants = await Tenant.findAll({
            where: {
                status: 'active'
            }
        });
        
        // 初始化每个租户的模型
        for (const tenant of tenants) {
            // 使用get()方法获取模型的原始数据
            const tenantData = tenant.get();
            await this.initTenantModels(tenantData.tenantId);
        }
    }
    
    /**
     * 删除租户的模型实例
     * @param {string} tenantId - 租户ID
     */
    public static removeTenantModels(tenantId: string): void {
        this.tenantModels.delete(tenantId);
    }
}
