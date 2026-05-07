const express = require('express');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/health', healthRoutes);
// Error middleware
app.use(errorMiddleware);

module.exports = app;