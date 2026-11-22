const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Mount routes
app.use('/api', searchRoutes);
app.use('/api/cars', searchRoutes);
app.use('/', searchRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'search-service', status: 'healthy', port: PORT, timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 [Search Service] running on http://localhost:${PORT}`);
});
