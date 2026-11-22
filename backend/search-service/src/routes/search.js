const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/search
router.get('/search', (req, res) => {
    let { make, model, minPrice, maxPrice, priceRange, q, search, sort } = req.query;
    const searchTerm = q || search;

    let conditions = [];
    let params = [];

    // Keyword Search
    if (searchTerm && searchTerm.trim() !== '') {
        const term = `%${searchTerm.trim()}%`;
        conditions.push(`(
            make LIKE ? OR 
            model LIKE ? OR 
            engine LIKE ? OR 
            exterior_color LIKE ? OR 
            interior_color LIKE ? OR
            CAST(year AS TEXT) LIKE ?
        )`);
        params.push(term, term, term, term, term, term);
    }

    // Filter by Make
    if (make && make !== 'All' && make !== 'Select Make') {
        conditions.push("LOWER(make) = LOWER(?)");
        params.push(make.trim());
    }

    // Filter by Model
    if (model && model !== 'All' && model !== 'Select Model') {
        conditions.push("LOWER(model) LIKE LOWER(?)");
        params.push(`%${model.trim()}%`);
    }

    // Price Range preset parsing
    if (priceRange) {
        if (priceRange === '$100k - $200k' || priceRange === '100k-200k') {
            minPrice = 100000;
            maxPrice = 200000;
        } else if (priceRange === '$200k - $500k' || priceRange === '200k-500k') {
            minPrice = 200000;
            maxPrice = 500000;
        } else if (priceRange === '$500k+' || priceRange === '500k+') {
            minPrice = 500000;
        }
    }

    // Min Price
    if (minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice))) {
        conditions.push("price >= ?");
        params.push(Number(minPrice));
    }

    // Max Price
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice))) {
        conditions.push("price <= ?");
        params.push(Number(maxPrice));
    }

    let whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

    // Sorting
    let orderClause = " ORDER BY id ASC";
    if (sort === 'price_asc') {
        orderClause = " ORDER BY price ASC";
    } else if (sort === 'price_desc') {
        orderClause = " ORDER BY price DESC";
    } else if (sort === 'year_desc') {
        orderClause = " ORDER BY year DESC";
    } else if (sort === 'year_asc') {
        orderClause = " ORDER BY year ASC";
    }

    const sql = `SELECT * FROM cars ${whereClause} ${orderClause}`;

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: "success",
            total: rows.length,
            filters: { make, model, minPrice, maxPrice, priceRange, searchTerm },
            data: rows
        });
    });
});

// GET /api/search/filters - distinct filter options
router.get('/search/filters', (req, res) => {
    const makesSql = "SELECT DISTINCT make FROM cars ORDER BY make ASC";
    const modelsSql = "SELECT make, model FROM cars ORDER BY make, model ASC";
    const statsSql = "SELECT MIN(price) as minPrice, MAX(price) as maxPrice, COUNT(*) as totalCars FROM cars";

    db.all(makesSql, [], (err, makeRows) => {
        if (err) return res.status(400).json({ error: err.message });

        db.all(modelsSql, [], (err2, modelRows) => {
            if (err2) return res.status(400).json({ error: err2.message });

            db.get(statsSql, [], (err3, stats) => {
                if (err3) return res.status(400).json({ error: err3.message });

                // Group models by make
                const modelsByMake = {};
                modelRows.forEach(item => {
                    if (!modelsByMake[item.make]) {
                        modelsByMake[item.make] = [];
                    }
                    if (!modelsByMake[item.make].includes(item.model)) {
                        modelsByMake[item.make].push(item.model);
                    }
                });

                res.json({
                    makes: makeRows.map(r => r.make),
                    modelsByMake,
                    stats: stats || { minPrice: 10000, maxPrice: 3800000, totalCars: 16 }
                });
            });
        });
    });
});

module.exports = router;
