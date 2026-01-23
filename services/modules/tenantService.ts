import Tenant from '../../models/modules/Tenant';
import { CreateTenantRequestBody, UpdateTenantRequestBody } from '../../types/tenant';
import { MultiTenantDbManager } from '../../config/multiTenantDbManager';
import { Op } from 'sequelize';

/**
 * 创建租户
 * @param {CreateTenantRequestBody} tenantData - 租户数据
 * @returns {Promise<Tenant>} 创建的租户对象
 * @throws {Error} 创建失败时抛出错误
 */
export const createTenant = async (
    tenantData: CreateTenantRequestBody
): Promise<Tenant> => {
    // 检查租户ID是否已存在
    const existingTenant = await Tenant.findOne({
        where: {
            tenantId: tenantData.tenantId
        }
    });
    
    if (existingTenant) {
        throw new Error('Tenant ID already exists');
    }
    
    // 创建租户
    const tenant = await Tenant.create(tenantData);
    
    // 为租户创建数据库连接
    MultiTenantDbManager.createTenantConnection(tenant.tenantId, tenant.dbConfig);
    
    return tenant;
};

/**
 * 获取租户列表
 * @param {string} name - 租户名称（可选）
 * @param {string} status - 租户状态（可选）
 * @returns {Promise<Tenant[]>} 租户列表
 */
export const getTenants = async (
    name?: string,
    status?: string
): Promise<Tenant[]> => {
    // 构建查询条件
    const where: any = {};
    
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    
    if (status) {
        where.status = status;
    }
    
    // 获取所有符合条件的租户
    return await Tenant.findAll({
        where,
        order: [['createdAt', 'DESC']]
    });
};

/**
 * 根据ID获取租户
 * @param {string} tenantId - 租户ID
 * @returns {Promise<Tenant | null>} 租户对象或null
 */
export const getTenantById = async (
    tenantId: string
): Promise<Tenant | null> => {
    return await Tenant.findByPk(tenantId);
};

/**
 * 更新租户
 * @param {string} tenantId - 租户ID
 * @param {UpdateTenantRequestBody} updateData - 更新数据
 * @returns {Promise<Tenant>} 更新后的租户对象
 * @throws {Error} 更新失败时抛出错误
 */
export const updateTenant = async (
    tenantId: string,
    updateData: UpdateTenantRequestBody
): Promise<Tenant> => {
    // 查找租户
    const tenant = await Tenant.findByPk(tenantId);
    
    if (!tenant) {
        throw new Error('Tenant not found');
    }
    
    // 更新租户
    await tenant.update(updateData);
    
    // 如果更新了数据库配置，重新创建数据库连接
    if (updateData.dbConfig) {
        MultiTenantDbManager.removeTenantConnection(tenantId);
        MultiTenantDbManager.createTenantConnection(tenantId, updateData.dbConfig);
    }
    
    return tenant;
};

/**
 * 删除租户
 * @param {string} tenantId - 租户ID
 * @returns {Promise<boolean>} 删除成功返回true
 * @throws {Error} 删除失败时抛出错误
 */
export const deleteTenant = async (
    tenantId: string
): Promise<boolean> => {
    // 查找租户
    const tenant = await Tenant.findByPk(tenantId);
    
    if (!tenant) {
        throw new Error('Tenant not found');
    }
    
    // 删除租户数据库连接
    MultiTenantDbManager.removeTenantConnection(tenantId);
    
    // 删除租户
    await tenant.destroy();
    
    return true;
};

/**
 * 初始化所有租户的数据库连接
 * @returns {Promise<void>} 初始化完成
 */
export const initAllTenantConnections = async (): Promise<void> => {
    // 获取所有活跃租户
    const tenants = await Tenant.findAll({
        where: {
            status: 'active'
        }
    });
    
    // 为每个租户创建数据库连接
    for (const tenant of tenants) {
        // 使用get()方法获取模型的原始数据
        const tenantData = tenant.get();
        MultiTenantDbManager.createTenantConnection(tenantData.tenantId, tenantData.dbConfig);
    }
};
