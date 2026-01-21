import Menu from '../../models/modules/Menu';
import { MenuType, CreateMenuRequestBody, UpdateMenuRequestBody } from '../../types/menu';
import { Op } from 'sequelize';

/**
 * 创建菜单
 * @param {CreateMenuRequestBody} menuData - 菜单数据
 * @returns {Promise<Menu>} 创建的菜单对象
 * @throws {Error} 创建失败时抛出错误
 */
export const createMenu = async (
    menuData: CreateMenuRequestBody
): Promise<Menu> => {
    return await Menu.create(menuData);
};

/**
 * 获取菜单列表
 * @param {string} name - 菜单名称（可选）
 * @param {MenuType} type - 菜单类型（可选）
 * @param {string} status - 菜单状态（可选）
 * @param {boolean} withChildren - 是否包含子菜单
 * @returns {Promise<Menu[]>} 菜单列表
 */
export const getMenus = async (
    name?: string,
    type?: MenuType,
    status?: 'active' | 'inactive',
    withChildren: boolean = true
): Promise<Menu[]> => {
    // 构建查询条件
    const where: any = {};
    
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    
    if (type) {
        where.type = type;
    }
    
    if (status) {
        where.status = status;
    }
    
    // 获取所有符合条件的菜单
    const menus = await Menu.findAll({
        where,
        order: [
            ['parentId', 'ASC'],
            ['order', 'ASC']
        ]
    });
    
    if (!withChildren) {
        return menus;
    }
    
    // 构建树形结构
    return buildMenuTree(menus);
};

/**
 * 构建菜单树形结构
 * @param {Menu[]} menus - 菜单列表
 * @returns {Menu[]} 树形结构的菜单列表
 */
const buildMenuTree = (menus: Menu[]): Menu[] => {
    // 将菜单列表转换为Map，便于查找
    const menuMap = new Map<number, Menu>();
    
    // 为每个菜单添加children属性
    menus.forEach(menu => {
        const menuData = menu.get() as any;
        menuData.children = [];
        menuMap.set(menuData.id, menu);
    });
    
    // 构建树形结构
    const rootMenus: Menu[] = [];
    menus.forEach(menu => {
        const menuData = menu.get() as any;
        if (menuData.parentId === null) {
            // 顶级菜单
            rootMenus.push(menu);
        } else {
            // 子菜单，添加到父菜单的children中
            const parentMenu = menuMap.get(menuData.parentId);
            if (parentMenu) {
                const parentData = parentMenu.get() as any;
                parentData.children?.push(menu);
            }
        }
    });
    
    return rootMenus;
};

/**
 * 根据ID获取菜单
 * @param {number} id - 菜单ID
 * @param {boolean} withChildren - 是否包含子菜单
 * @returns {Promise<Menu | null>} 菜单对象或null
 */
export const getMenuById = async (
    id: number,
    withChildren: boolean = false
): Promise<Menu | null> => {
    if (!withChildren) {
        return await Menu.findByPk(id);
    }
    
    // 获取所有菜单
    const allMenus = await Menu.findAll({
        order: [['order', 'ASC']]
    });
    
    // 构建树形结构
    const menuTree = buildMenuTree(allMenus);
    
    // 查找指定ID的菜单
    return findMenuInTree(menuTree, id);
};

/**
 * 在树形结构中查找菜单
 * @param {Menu[]} menuTree - 菜单树形结构
 * @param {number} id - 菜单ID
 * @returns {Menu | null} 菜单对象或null
 */
const findMenuInTree = (menuTree: Menu[], id: number): Menu | null => {
    for (const menu of menuTree) {
        const menuData = menu.get() as any;
        if (menuData.id === id) {
            return menu;
        }
        
        if (menuData.children && menuData.children.length > 0) {
            const found = findMenuInTree(menuData.children, id);
            if (found) {
                return found;
            }
        }
    }
    
    return null;
};

/**
 * 更新菜单
 * @param {number} id - 菜单ID
 * @param {UpdateMenuRequestBody} updateData - 更新数据
 * @returns {Promise<Menu>} 更新后的菜单对象
 * @throws {Error} 更新失败时抛出错误
 */
export const updateMenu = async (
    id: number,
    updateData: UpdateMenuRequestBody
): Promise<Menu> => {
    // 查找菜单
    const menu = await Menu.findByPk(id);
    
    if (!menu) {
        throw new Error('Menu not found');
    }
    
    // 更新菜单
    await menu.update(updateData);
    
    return menu;
};

/**
 * 删除菜单
 * @param {number} id - 菜单ID
 * @returns {Promise<boolean>} 删除成功返回true
 * @throws {Error} 删除失败时抛出错误
 */
export const deleteMenu = async (
    id: number
): Promise<boolean> => {
    // 查找菜单
    const menu = await Menu.findByPk(id);
    
    if (!menu) {
        throw new Error('Menu not found');
    }
    
    // 删除菜单
    await menu.destroy();
    
    return true;
};

/**
 * 获取菜单树形结构（用于前端展示）
 * @param {string} status - 菜单状态（可选，默认active）
 * @returns {Promise<Menu[]>} 菜单树形结构
 */
export const getMenuTree = async (
    status: 'active' | 'inactive' = 'active'
): Promise<Menu[]> => {
    return await getMenus(undefined, undefined, status, true);
};
