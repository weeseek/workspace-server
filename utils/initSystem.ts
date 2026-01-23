import bcrypt from 'bcrypt';
import Tenant from '../models/modules/Tenant';
import { TenantStatus, DbType } from '../types/tenant';
import { MultiTenantDbManager } from '../config/multiTenantDbManager';
import { ModelFactory } from '../models/ModelFactory';

/**
 * 初始化系统租户和超级管理员
 * 在应用启动时执行，确保系统有一个默认的租户和管理员用户
 */
export async function initSystem(): Promise<void> {
    try {
        console.log('🔄 Initializing system...');
        
        // 1. 检查系统租户是否存在
        const systemTenantId = 'system';
        const systemTenant = await Tenant.findOne({
            where: {
                tenantId: systemTenantId
            }
        });
        
        if (!systemTenant) {
            console.log('📦 Creating system tenant...');
            // 创建系统租户
            await Tenant.create({
                tenantId: systemTenantId,
                name: 'System Tenant',
                status: TenantStatus.ACTIVE,
                dbConfig: {
                    type: DbType.SQLITE,
                    name: 'system_tenant',
                    storage: `./databases/${systemTenantId}.sqlite`
                },
                description: 'Default system tenant'
            });
            console.log('✅ System tenant created successfully');
        } else {
            console.log('✅ System tenant already exists');
        }
        
        // 2. 为系统租户创建数据库连接
        if (!MultiTenantDbManager.hasTenantConnection(systemTenantId)) {
            const tenant = await Tenant.findOne({
                where: {
                    tenantId: systemTenantId
                }
            });
            
            if (tenant) {
                // 使用get()方法获取模型的原始数据
                const tenantData = tenant.get();
                MultiTenantDbManager.createTenantConnection(tenantData.tenantId, tenantData.dbConfig);
                console.log('✅ System tenant database connection created');
            }
        } else {
            console.log('✅ System tenant database connection already exists');
        }
        
        // 3. 初始化系统租户的模型
        await ModelFactory.initTenantModels(systemTenantId);
        console.log('✅ System tenant models initialized');
        
        // 4. 检查超级管理员是否存在
        const User = ModelFactory.getTenantModel(systemTenantId, 'User');
        const adminUsername = 'admin';
        const adminEmail = 'admin@example.com';
        
        const existingAdmin = await User.findOne({
            where: {
                username: adminUsername,
                tenantId: systemTenantId
            }
        });
        
        if (!existingAdmin) {
            console.log('👨‍💼 Creating super admin user...');
            // 创建超级管理员用户
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await User.create({
                username: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                status: 'active',
                tenantId: systemTenantId
            });
            
            console.log('✅ Super admin user created successfully');
            console.log(`📝 Username: ${adminUsername}`);
            console.log(`🔑 Password: admin123`);
            console.log(`📧 Email: ${adminEmail}`);
        } else {
            console.log('✅ Super admin user already exists');
        }
        
        console.log('✅ System initialization completed successfully');
    } catch (error) {
        console.error('❌ System initialization failed:', (error as Error).message);
        console.error('Error stack:', (error as Error).stack);
        throw error;
    }
}
