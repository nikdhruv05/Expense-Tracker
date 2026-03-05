const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — allow all origins in dev; in production Vercel handles this
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running 🚀' });
});

// MongoDB connection (cached for serverless reuse)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('✅ Connected to MongoDB');
}

// For local development — start Express server normally  
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1);
    });
}

// For Vercel serverless — connect on each cold start, then handle request
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ message: 'DB connection failed', error: err.message });
  }
  return app(req, res);
};
