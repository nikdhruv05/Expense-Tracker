const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS — allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight for all routes
app.options('*', cors());

app.use(express.json());

// Routes
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running 🚀' });
});

// ── MongoDB connection (cached for serverless reuse) ──────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('✅ Connected to MongoDB');
}

// ── Local development ─────────────────────────────────────────────────────────
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

// ── Vercel Serverless Handler ─────────────────────────────────────────────────
// IMPORTANT: Set CORS headers FIRST before any async work, so preflight
// OPTIONS requests always get the right headers even if DB is slow.
module.exports = async (req, res) => {
  // Always set CORS headers immediately
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Respond to preflight immediately — no DB needed
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to DB, then hand off to Express app
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ message: 'DB connection failed', error: err.message });
  }

  return app(req, res);
};
