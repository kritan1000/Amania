/**
 * Main Server File
 * Express server setup with admin routes integration
 * Handles CORS, JSON parsing, and database synchronization
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authRoutes } = require('./routes');
const adminRoutes = require('./admin/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/products.js');
const { db } = require('./config/db');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.sync({alter: true})