import Router from 'koa-router';
import swaggerSpec from '../../config/swaggerConfig';

const router = new Router();

// Swagger API 文档路由 - 改为 /api/docs.json
router.get('/api/docs.json', async (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
});

// 健康检查路由
/**
 * @swagger
 * /health: 
 *   get:
 *     summary: 健康检查
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 服务健康状态
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/health', async (ctx) => {
  ctx.body = {
    code: 200,
    message: 'success',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  };
});

// 自定义 Swagger UI HTML 页面，使用 CDN 加载 Swagger UI 静态资源
// 访问地址改为 /api/docs
router.get('/api/docs', async (ctx) => {
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.31.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.31.0/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.31.0/favicon-16x16.png" sizes="16x16" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.31.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.31.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      // 配置 Swagger UI，指向新的 API 文档地址 /api/docs.json
      SwaggerUIBundle({
        url: '/api/docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        explorer: true,
        swaggerOptions: {
          persistAuthorization: true,
        }
      });
    };
  </script>
</body>
</html>
  `;
  
  ctx.type = 'text/html';
  ctx.body = swaggerHtml;
});

export default router;
