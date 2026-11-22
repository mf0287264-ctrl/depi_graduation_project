const { spawn, execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('\x1b[1m\x1b[35m');
console.log('  ╔════════════════════════════════════════════════╗');
console.log('  ║         HEXA XOTICS — Development Mode        ║');
console.log('  ╚════════════════════════════════════════════════╝');
console.log('\x1b[0m');

// 1. Start backend microservices
const backend = spawn(process.execPath, [path.join(root, 'backend', 'start-all.js')], {
  cwd: path.join(root, 'backend'),
  stdio: 'inherit',
});

// 2. Wait 2s then start frontend dev server
setTimeout(() => {
  console.log('\n\x1b[1m\x1b[36m[FRONTEND] Starting Vite dev server on http://localhost:5173 ...\x1b[0m\n');

  // Resolve the vite binary directly — avoids shell:true / .cmd issues on Windows Node v24
  const viteBin = path.join(root, 'frontend', 'node_modules', '.bin', 'vite');
  // On Windows we can run the JS entry of vite directly with node
  const viteEntry = path.join(root, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');

  const frontend = spawn(process.execPath, [viteEntry, '--host'], {
    cwd: path.join(root, 'frontend'),
    stdio: 'inherit',
    env: { ...process.env },
  });

  frontend.on('close', (code) => {
    console.log(`\x1b[36m[FRONTEND]\x1b[0m Vite exited with code ${code}`);
    process.exit(code);
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`\x1b[35m[BACKEND]\x1b[0m Microservices exited with code ${code}`);
});

process.on('SIGINT', () => {
  backend.kill();
  process.exit(0);
});
