const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Global Middleware
app.use(cors({
    origin: '*', // In production, replace with specific frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse incoming JSON request bodies

// Structured Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

// Centralized API Router
app.use('/api', apiRoutes);

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Requested endpoint not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'An unexpected internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('==================================================');
    console.log('      SmartSpend Secure REST API Service          ');
    console.log('==================================================');
    console.log(`  Local Service: http://localhost:${PORT}`);
    console.log(`  Endpoints Prefix: http://localhost:${PORT}/api`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log('==================================================');
});

module.exports = app;
