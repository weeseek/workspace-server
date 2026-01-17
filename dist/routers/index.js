"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (app) => {
    const modulesPath = path_1.default.join(__dirname, 'modules');
    const moduleFiles = fs_1.default.readdirSync(modulesPath).filter(file => {
        return ((file.endsWith('.ts') && !file.endsWith('.d.ts')) || file.endsWith('.js')) && !file.startsWith('.');
    });
    moduleFiles.forEach(file => {
        const modulePath = path_1.default.join(modulesPath, file);
        const routerModule = require(modulePath);
        const router = routerModule.default || routerModule;
        app.use(router.routes());
        app.use(router.allowedMethods());
        console.log(`📦 Loaded route module: ${file}`);
    });
    console.log('📦 All routes registered successfully');
};
//# sourceMappingURL=index.js.map