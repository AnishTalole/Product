// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ADD THIS LINE: Import your routes
const doctorRoutes = require('./routes/doctorRoutes'); 

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
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

// ADD THIS LINE: Tell the app to use your doctor routes
app.use('/api/doctors', doctorRoutes); 

// Serving local files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// server/server.js
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));

// Authentication
app.use('/api/auth', authRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));