
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const leaderRoutes = require('./routes/leaders');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


app.use('/api/leaders', leaderRoutes);

// Check MongoDB environment variable
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in backend/.env');
    process.exit(1);
}


mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: 'gym-leader-registry'
    })
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });
