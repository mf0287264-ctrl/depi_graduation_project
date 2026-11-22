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
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

console.log(`[User Service] Connecting to database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`[User Service] DB Error: ${err.message}`);
    } else {
        console.log(`[User Service] Connected to SQLite database.`);
        initTables();
    }
});

function initTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            phone TEXT,
            profile_image TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            car_id INTEGER,
            UNIQUE(user_id, car_id)
        )`);
    });
}

module.exports = db;
