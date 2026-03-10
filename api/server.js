const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const doctorRoutes = require('./routes/doctorRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. IMPROVED CORS (Important for Production)
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get('/api/test', (req, res) => {
    res.json({ 
        status: "Success", 
        message: "Backend is synced with Frontend!",
        timestamp: new Date()
    });
});

app.use('/api/doctors', doctorRoutes); 
app.use('/api/auth', authRoutes);

// 2. STATIC FILES (Note: Vercel is read-only, see warning below)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// 3. SERVERLESS ADAPTATION
// We export the app and only call .listen() if we are running locally.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;