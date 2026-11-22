const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Mount routes
app.use('/api', paymentRoutes);
app.use('/', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ service: 'payment-service', status: 'healthy', port: PORT, timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`🚀 [Payment Service] running on http://localhost:${PORT}`);
});
