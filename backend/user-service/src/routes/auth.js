const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/db');

// Multer Setup for avatars
// Assets can be uploaded to shared assets or public assets
const assetsDir = path.resolve(__dirname, '../../../../frontend/public/assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, assetsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// POST /api/signup
router.post('/signup', (req, res) => {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    username = username.trim();
    email = email.trim();
    password = password.trim();

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.run(sql, [username, email, password], function(err) {
        if (err) {
            if (err.message && err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Username or Email already exists." });
            }
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: "User registered successfully",
            id: this.lastID,
            user: { id: this.lastID, username, email }
        });
    });
});

// POST /api/login
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing data" });
    }

    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.get(sql, [username.trim(), username.trim()], (err, user) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!user || user.password !== password.trim()) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.json({
            success: true,
            message: "Login success",
            userId: user.id,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                profile_image: user.profile_image
            }
        });
    });
});

// GET /api/user/:id
router.get('/user/:id', (req, res) => {
    const sql = "SELECT id, username, email, phone, profile_image FROM users WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "User not found" });
        res.json(row);
    });
});

// GET /api/me
router.get('/me', (req, res) => {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const sql = "SELECT id, username, email, phone, profile_image FROM users WHERE id = ?";
    db.get(sql, [userId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "User not found" });
        res.json({ user: row });
    });
});

// POST /api/logout
router.post('/logout', (req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
});

// POST /api/upload-avatar/:id
router.post('/upload-avatar/:id', upload.single('avatar'), (req, res) => {
    const userId = req.params.id;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `/assets/${file.filename}`;
    const sql = "UPDATE users SET profile_image = ? WHERE id = ?";
    db.run(sql, [imageUrl, userId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Image uploaded successfully", imageUrl: imageUrl });
    });
});

// PUT /api/update-user/:id
router.put('/update-user/:id', (req, res) => {
    const userId = req.params.id;
    const { username, phone } = req.body;
    const sql = "UPDATE users SET username = ?, phone = ? WHERE id = ?";
    db.run(sql, [username, phone, userId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "User updated successfully" });
    });
});

// DELETE /api/delete-account/:id
router.delete('/delete-account/:id', (req, res) => {
    const userId = req.params.id;
    db.serialize(() => {
        db.run("DELETE FROM wishlist WHERE user_id = ?", [userId]);
        db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Account deleted successfully" });
        });
    });
});

module.exports = router;
