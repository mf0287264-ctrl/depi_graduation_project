const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const candidatePaths = [
    process.env.DB_PATH,
    path.resolve(__dirname, '../../../../hexaxotics.db'),
    path.resolve(__dirname, '../../../data/hexaxotics.db'),
    path.resolve(__dirname, '../../data/hexaxotics.db'),
    path.resolve(__dirname, '../../../hexaxotics.db')
].filter(Boolean);

let dbPath = candidatePaths.find(p => fs.existsSync(p));

if (!dbPath) {
    dbPath = path.resolve(__dirname, '../../data/hexaxotics.db');
}

console.log(`[Search Service] Connecting to database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`[Search Service] DB Error: ${err.message}`);
    } else {
        console.log(`[Search Service] Connected to SQLite database.`);
    }
});

module.exports = db;
