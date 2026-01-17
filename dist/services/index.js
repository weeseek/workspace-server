"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const services = {};
const modulesDir = path_1.default.join(__dirname, 'modules');
fs_1.default.readdirSync(modulesDir).forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const serviceName = file.replace(/\.(ts|js)$/, '');
        const modulePath = path_1.default.join(modulesDir, file);
        services[serviceName] = require(modulePath);
    }
});
exports.default = services;
//# sourceMappingURL=index.js.map