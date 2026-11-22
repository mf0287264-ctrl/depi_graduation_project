const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/cars
router.get('/cars', (req, res) => {
    const sql = "SELECT * FROM cars";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// GET /api/cars/:id
router.get('/cars/:id', (req, res) => {
    const sql = "SELECT * FROM cars WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Car not found" });
        res.json({ message: "success", data: row });
    });
});

// POST /api/cars (Admin / Inventory creation)
router.post('/cars', (req, res) => {
    const {
        make, model, year, price, image_url, gallery,
        engine, horsepower, zero_to_sixty, top_speed,
        transmission, mileage, exterior_color, interior_color
    } = req.body;

    if (!make || !model || !price) {
        return res.status(400).json({ error: "Make, model, and price are required." });
    }

    const galleryJson = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []);

    const sql = `INSERT INTO cars (
        make, model, year, price, image_url, gallery,
        engine, horsepower, zero_to_sixty, top_speed,
        transmission, mileage, exterior_color, interior_color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        make, model, year || new Date().getFullYear(), price,
        image_url || '/assets/hero2.jpg', galleryJson,
        engine || '', horsepower || '', zero_to_sixty || '', top_speed || '',
        transmission || '', mileage || '', exterior_color || '', interior_color || ''
    ], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({
            message: "Car added successfully",
            id: this.lastID
        });
    });
});

// PUT /api/cars/:id
router.put('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const {
        make, model, year, price, image_url, gallery,
        engine, horsepower, zero_to_sixty, top_speed,
        transmission, mileage, exterior_color, interior_color
    } = req.body;

    const galleryJson = gallery !== undefined ? (typeof gallery === 'string' ? gallery : JSON.stringify(gallery)) : undefined;

    const sql = `UPDATE cars SET
        make = COALESCE(?, make),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        price = COALESCE(?, price),
        image_url = COALESCE(?, image_url),
        gallery = COALESCE(?, gallery),
        engine = COALESCE(?, engine),
        horsepower = COALESCE(?, horsepower),
        zero_to_sixty = COALESCE(?, zero_to_sixty),
        top_speed = COALESCE(?, top_speed),
        transmission = COALESCE(?, transmission),
        mileage = COALESCE(?, mileage),
        exterior_color = COALESCE(?, exterior_color),
        interior_color = COALESCE(?, interior_color)
        WHERE id = ?`;

    db.run(sql, [
        make, model, year, price, image_url, galleryJson,
        engine, horsepower, zero_to_sixty, top_speed,
        transmission, mileage, exterior_color, interior_color,
        carId
    ], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Car updated successfully" });
    });
});

// DELETE /api/cars/:id
router.delete('/cars/:id', (req, res) => {
    const carId = req.params.id;
    db.run("DELETE FROM cars WHERE id = ?", [carId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Car deleted successfully" });
    });
});

module.exports = router;
