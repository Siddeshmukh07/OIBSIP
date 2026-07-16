const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple API routes (mocking a database)
const trades = [];

// Get all trades
app.get('/api/trades', (req, res) => {
    res.json(trades);
});

// Add a new trade
app.post('/api/trades', (req, res) => {
    const trade = {
        id: Date.now().toString(),
        ...req.body,
        date: new Date().toISOString()
    };
    trades.push(trade);
    res.status(201).json(trade);
});

// Delete a trade
app.delete('/api/trades/:id', (req, res) => {
    const index = trades.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        trades.splice(index, 1);
        res.json({ message: 'Trade deleted' });
    } else {
        res.status(404).json({ error: 'Trade not found' });
    }
});

// Fallback to serve index.html for SPA-like behavior if needed
// app.get('*', ...) is disabled to avoid path-to-regexp v8 wildcard syntax issues
app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
