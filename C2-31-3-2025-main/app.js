require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const menuRoutes = require('./routes/menu');
const cors = require('cors'); // Thêm cors

const app = express();

// Thêm middleware CORS
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));