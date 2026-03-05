import { useState } from 'react';
import { addExpense } from '../api/expenseApi';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

const CATEGORY_COLORS = {
  Food: 'text-emerald-400',
  Travel: 'text-sky-400',
  Shopping: 'text-violet-400',
  Bills: 'text-amber-400',
  Other: 'text-rose-400',
};

export default function AddExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.amount || !form.date) {
      setError('Please fill in all fields.');
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    try {
      setLoading(true);
      await addExpense({ ...form, amount: parseFloat(form.amount) });
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      onExpenseAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className="text-2xl">➕</span> Add New Expense
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Dinner at restaurant"
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 transition"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 500"
            min="0"
            step="0.01"
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [color-scheme:dark]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-indigo-900/40"
        >
          {loading ? 'Adding…' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}
