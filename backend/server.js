require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const profileRoutes = require('./routes/profile');
const autofillRoutes = require('./routes/autofill');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); 
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000', 'chrome-extension://*'],
    credentials: true
})); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/profiles', profileRoutes); 
app.use('/api/autofill', autofillRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n🤖 AI Matching Endpoints (field names only):`);
    console.log(`   - POST http://localhost:${PORT}/api/autofill/match-fields`);
    console.log(`   - POST http://localhost:${PORT}/api/autofill/match-multiple`);
    console.log(`   - GET  http://localhost:${PORT}/api/autofill/ai-health`);
    console.log(`\n✨ Complete Autofill Endpoints (AI + Database):`);
    console.log(`   - POST http://localhost:${PORT}/api/autofill/get-field-value`);
    console.log(`   - POST http://localhost:${PORT}/api/autofill/get-multiple-values`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});