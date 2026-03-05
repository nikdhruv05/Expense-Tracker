const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// POST /api/expenses - Add a new expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const expense = new Expense({ title, amount, category, date });
    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/expenses - Get all expenses, optionally filtered by ?month=&year=
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      // Build date range for the given month (month is 1-indexed from client)
      const start = new Date(y, m - 1, 1);       // e.g. 2026-03-01 00:00:00
      const end   = new Date(y, m, 1);            // e.g. 2026-04-01 00:00:00
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// DELETE /api/expenses/:id - Delete an expense by ID
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
