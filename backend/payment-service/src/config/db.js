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

console.log(`[Payment Service] Connecting to database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(`[Payment Service] DB Error: ${err.message}`);
    } else {
        console.log(`[Payment Service] Connected to SQLite database.`);
        initOrderTables();
    }
});

function initOrderTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            user_email TEXT,
            car_id INTEGER,
            car_model TEXT,
            base_price REAL,
            luxury_tax REAL,
            doc_fee REAL,
            total_price REAL,
            payment_method TEXT,
            card_last4 TEXT,
            cardholder_name TEXT,
            status TEXT DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

module.exports = db;
