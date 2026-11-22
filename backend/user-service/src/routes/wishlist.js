const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/wishlist/add
router.post('/wishlist/add', (req, res) => {
    const { userId, carId } = req.body;
    if (!userId || !carId) {
        return res.status(400).json({ error: "User ID and Car ID required" });
    }

    const sql = "INSERT INTO wishlist (user_id, car_id) VALUES (?, ?)";
    db.run(sql, [userId, carId], function(err) {
        if (err) {
            if (err.message && err.message.includes("UNIQUE constraint failed")) {
                return res.json({ message: "Car already in wishlist", inWishlist: true });
            }
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Car added to wishlist", inWishlist: true, id: this.lastID });
    });
});

// POST /api/wishlist/remove
router.post('/wishlist/remove', (req, res) => {
    const { userId, carId } = req.body;
    if (!userId || !carId) {
        return res.status(400).json({ error: "User ID and Car ID required" });
    }

    const sql = "DELETE FROM wishlist WHERE user_id = ? AND car_id = ?";
    db.run(sql, [userId, carId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Car removed from wishlist", inWishlist: false });
    });
});

// GET /api/wishlist/:userId
router.get('/wishlist/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT cars.* FROM wishlist 
        JOIN cars ON wishlist.car_id = cars.id 
        WHERE wishlist.user_id = ?
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            // Fallback: If cars table is empty or separate, return wishlist IDs
            const fallbackSql = "SELECT car_id FROM wishlist WHERE user_id = ?";
            db.all(fallbackSql, [userId], (fbErr, fbRows) => {
                if (fbErr) return res.status(400).json({ error: err.message });
                return res.json({ message: "success", data: fbRows });
            });
            return;
        }
        res.json({ message: "success", data: rows });
    });
});

// GET /api/wishlist/check/:userId/:carId
router.get('/wishlist/check/:userId/:carId', (req, res) => {
    const { userId, carId } = req.params;
    const sql = "SELECT id FROM wishlist WHERE user_id = ? AND car_id = ?";
    db.get(sql, [userId, carId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ inWishlist: Boolean(row) });
    });
});

module.exports = router;
