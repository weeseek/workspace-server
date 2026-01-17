const fs = require('fs');
const path = require('path');

const services = {};
const modulesDir = path.join(__dirname, 'modules');

fs.readdirSync(modulesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const serviceName = file.replace('.js', '');
        services[serviceName] = require(path.join(modulesDir, file));
    }
});

module.exports = services;
