import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';
import { MenuType } from '../../types/menu';

// 定义Menu属性接口
interface MenuAttributes {
    id: number;
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
            model: Menu,
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

export default Menu;
