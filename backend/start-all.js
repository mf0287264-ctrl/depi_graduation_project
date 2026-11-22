const { spawn } = require('child_process');
const path = require('path');

const services = [
    { name: 'USER-SERVICE   ', port: 4001, dir: 'user-service', file: path.join(__dirname, 'user-service/src/server.js'), color: '\x1b[36m' },
    { name: 'CATALOG-SERVICE', port: 4002, dir: 'catalog-service', file: path.join(__dirname, 'catalog-service/src/server.js'), color: '\x1b[32m' },
    { name: 'SEARCH-SERVICE ', port: 4003, dir: 'search-service', file: path.join(__dirname, 'search-service/src/server.js'), color: '\x1b[33m' },
    { name: 'PAYMENT-SERVICE', port: 4004, dir: 'payment-service', file: path.join(__dirname, 'payment-service/src/server.js'), color: '\x1b[35m' }
];

const resetColor = '\x1b[0m';

console.log('\x1b[1m\x1b[34m=======================================================');
console.log('   HEXA XOTICS - Launching Backend Microservices Suite');
console.log('=======================================================\x1b[0m\n');

const nodePath = path.join(__dirname, 'node_modules');

services.forEach(svc => {
    const cwd = path.join(__dirname, svc.dir);
    const proc = spawn(process.execPath, [svc.file], {
        cwd,
        env: {
            ...process.env,
            PORT: svc.port,
            NODE_PATH: nodePath
        }
    });

    proc.stdout.on('data', (data) => {
        const lines = data.toString().trim().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log(`${svc.color}[${svc.name}]${resetColor} ${line}`);
            }
        });
    });

    proc.stderr.on('data', (data) => {
        const lines = data.toString().trim().split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.error(`${svc.color}[${svc.name} ERROR]${resetColor} \x1b[31m${line}\x1b[0m`);
            }
        });
    });

    proc.on('close', (code) => {
        console.log(`${svc.color}[${svc.name}]${resetColor} Process exited with code ${code}`);
    });
});
