import Router from 'koa-router';
import { createTenant, getTenants, getTenantById, updateTenant, deleteTenant } from '../../services/modules/tenantService';
import { sendSuccess, sendCreated, sendNotFound, sendClientError } from '../../utils/response';
import { CreateTenantRequestBody, UpdateTenantRequestBody } from '../../types/tenant';
import { permissionMiddleware, Role } from '../../middlewares/modules/permissionMiddleware';

const router = new Router({
    prefix: '/api/tenants' // 添加路由前缀
});

/**
 * @swagger
 * /api/tenants: 
 *   post:
 *     summary: 创建租户
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *               - name
 *               - dbConfig
 *             properties:
 *               tenantId: {
 *                 type: string
 *               }
 *               name: {
 *                 type: string
 *               }
 *               status: {
 *                 type: string
 *               }
 *               dbConfig: {
 *                 type: object
 *               }
 *               description: {
 *                 type: string
 *               }
 *     responses:
 *       201:
 *         description: 租户创建成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.post('/', permissionMiddleware([Role.CREATE_ADMIN, Role.SUPER_ADMIN]), async (ctx) => {
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    try {
        const tenant = await createTenant(body as CreateTenantRequestBody);
        sendCreated(ctx, 'Tenant created successfully', { tenant: tenant.toJSON() });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to create tenant');
    }
});

/**
 * @swagger
 * /api/tenants: 
 *   get:
 *     summary: 获取租户列表
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: 租户名称（可选）
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 租户状态（可选）
 *     responses:
 *       200:
 *         description: 租户列表
 *       401:
 *         description: 未授权
 */
router.get('/', async (ctx) => {
    const query = ctx.query as any;
    
    try {
        const tenants = await getTenants(query.name, query.status);
        sendSuccess(ctx, 'Tenants retrieved successfully', { tenants: tenants.map(tenant => tenant.toJSON()) });
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve tenants');
    }
});

/**
 * @swagger
 * /api/tenants/{tenantId}: 
 *   get:
 *     summary: 根据ID获取租户
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: 租户ID
 *     responses:
 *       200:
 *         description: 租户信息
 *       401:
 *         description: 未授权
 *       404:
 *         description: 租户不存在
 */
router.get('/:tenantId', async (ctx) => {
    const tenantId = ctx.params.tenantId;
    
    try {
        const tenant = await getTenantById(tenantId);
        if (tenant) {
            sendSuccess(ctx, 'Tenant retrieved successfully', { tenant: tenant.toJSON() });
        } else {
            sendNotFound(ctx, 'Tenant not found');
        }
    } catch (error) {
        sendClientError(ctx, (error as Error).message || 'Failed to retrieve tenant');
    }
});

/**
 * @swagger
 * /api/tenants/{tenantId}: 
 *   put:
 *     summary: 更新租户
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: 租户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {
 *                 type: string
 *               }
 *               status: {
 *                 type: string
 *               }
 *               dbConfig: {
 *                 type: object
 *               }
 *               description: {
 *                 type: string
 *               }
 *     responses:
 *       200:
 *         description: 租户更新成功
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 租户不存在
 */
router.put('/:tenantId', permissionMiddleware([Role.CREATE_ADMIN, Role.SUPER_ADMIN]), async (ctx) => {
    const tenantId = ctx.params.tenantId;
    let body: any = ctx.request.body;
    
    // 增强健壮性：处理字符串类型的请求体
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            sendClientError(ctx, 'Invalid JSON format in request body');
            return;
        }
    }
    
    try {
        const tenant = await updateTenant(tenantId, body as UpdateTenantRequestBody);
        sendSuccess(ctx, 'Tenant updated successfully', { tenant: tenant.toJSON() });
    } catch (error) {
        if ((error as Error).message === 'Tenant not found') {
            sendNotFound(ctx, 'Tenant not found');
        } else {
            sendClientError(ctx, (error as Error).message || 'Failed to update tenant');
        }
    }
});

/**
 * @swagger
 * /api/tenants/{tenantId}: 
 *   delete:
 *     summary: 删除租户
 *     tags: [Tenant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: 租户ID
 *     responses:
 *       200:
 *         description: 租户删除成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 租户不存在
 */
router.delete('/:tenantId', permissionMiddleware([Role.CREATE_ADMIN, Role.SUPER_ADMIN]), async (ctx) => {
    const tenantId = ctx.params.tenantId;
    
    try {
        await deleteTenant(tenantId);
        sendSuccess(ctx, 'Tenant deleted successfully');
    } catch (error) {
        if ((error as Error).message === 'Tenant not found') {
            sendNotFound(ctx, 'Tenant not found');
        } else {
            sendClientError(ctx, (error as Error).message || 'Failed to delete tenant');
        }
    }
});

export default router;
