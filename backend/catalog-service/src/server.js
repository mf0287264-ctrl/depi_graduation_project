const express = require('express');
const cors = require('cors');
const path = require('path');
const carsRoutes = require('./routes/cars');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Static assets
const assetsDir = [
    path.resolve(__dirname, '../../../frontend/public/assets'),
    path.resolve(__dirname, '../../data/assets')
].find(p => require('fs').existsSync(p)) || path.resolve(__dirname, '../../../frontend/public/assets');
app.use('/assets', express.static(assetsDir));

// Mount routes
app.use('/api', carsRoutes);
app.use('/', carsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'catalog-service', status: 'healthy', port: PORT, timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 [Catalog Service] running on http://localhost:${PORT}`);
});
