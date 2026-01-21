/**
 * 菜单相关类型定义
 */

// 定义菜单类型枚举
export enum MenuType {
    // 节点类型：可以包含子菜单
    NODE = 'node',
    // 页面类型：指向系统内页面
    PAGE = 'page',
    // 超链接类型：指向外部URL
    LINK = 'link'
}

// 定义菜单请求体接口
export interface CreateMenuRequestBody {
    // 菜单名称
    name: string;
    // 菜单类型
    type: MenuType;
    // 父菜单ID，顶级菜单为null
    parentId?: number | null;
    // 菜单路径或URL
    path: string;
    // 菜单图标
    icon?: string;
    // 菜单排序
    order?: number;
    // 菜单状态
    status?: 'active' | 'inactive';
    // 是否隐藏
    hidden?: boolean;
    // 菜单权限标识
    permission?: string;
    // 菜单描述
    description?: string;
}

// 定义菜单更新请求体接口
export interface UpdateMenuRequestBody extends Partial<CreateMenuRequestBody> {
    // 菜单ID，仅用于更新时验证
    id?: number;
}

// 定义菜单查询参数接口
export interface MenuQueryParams {
    // 菜单名称
    name?: string;
    // 菜单类型
    type?: MenuType;
    // 菜单状态
    status?: 'active' | 'inactive';
    // 是否包含子菜单
    withChildren?: boolean;
}

// 定义菜单响应接口
export interface MenuResponse {
    // 菜单ID
    id: number;
    // 菜单名称
    name: string;
    // 菜单类型
    type: MenuType;
    // 父菜单ID
    parentId: number | null;
    // 菜单路径或URL
    path: string;
    // 菜单图标
    icon?: string;
    // 菜单排序
    order: number;
    // 菜单状态
    status: 'active' | 'inactive';
    // 是否隐藏
    hidden: boolean;
    // 菜单权限标识
    permission?: string;
    // 菜单描述
    description?: string;
    // 子菜单列表
    children?: MenuResponse[];
    // 创建时间
    createdAt: Date;
    // 更新时间
    updatedAt: Date;
}
