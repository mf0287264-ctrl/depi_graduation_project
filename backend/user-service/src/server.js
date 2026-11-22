const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Serve static assets if needed
const assetsDir = [
    path.resolve(__dirname, '../../../frontend/public/assets'),
    path.resolve(__dirname, '../../data/assets')
].find(p => require('fs').existsSync(p)) || path.resolve(__dirname, '../../../frontend/public/assets');
app.use('/assets', express.static(assetsDir));

// Routes - supports both /api and root mounting for compatibility
app.use('/api', authRoutes);
app.use('/api', wishlistRoutes);
app.use('/', authRoutes);
app.use('/', wishlistRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'user-service', status: 'healthy', port: PORT, timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 [User Service] running on http://localhost:${PORT}`);
});
