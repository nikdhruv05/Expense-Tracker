import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from './api/expenseApi';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import MonthlyTotal from './components/MonthlyTotal';
import CategoryPieChart from './components/CategoryPieChart';
import MonthFilter from './components/MonthFilter';
import MonthlySummary from './components/MonthlySummary';
import AIInsights from './components/AIInsights';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function App() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [allExpenses, setAllExpenses]         = useState([]);   // always unfiltered
  const [filteredExpenses, setFilteredExpenses] = useState([]); // respects month filter
  const [selectedMonth, setSelectedMonth]     = useState(null);
  const [selectedYear, setSelectedYear]       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [fetchError, setFetchError]           = useState('');

  // ─── Data Fetching ────────────────────────────────────────────────────────
  // Always fetch the full dataset (for MonthlySummary + all-time totals)
  const fetchAllExpenses = useCallback(async () => {
    try {
      const res = await getExpenses();
      setAllExpenses(res.data);
    } catch {
      // silently update; fetchFilteredExpenses will show the error
    }
  }, []);

  // Fetch filtered dataset (driven by selectedMonth/Year state)
  const fetchFilteredExpenses = useCallback(async (month, year) => {
    try {
      setFetchError('');
      const params = month && year ? { month, year } : {};
      const res = await getExpenses(params);
      setFilteredExpenses(res.data);
    } catch {
      setFetchError('Could not load expenses. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount and whenever filter changes, re-fetch both
  useEffect(() => {
    setLoading(true);
    fetchAllExpenses();
    fetchFilteredExpenses(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchAllExpenses, fetchFilteredExpenses]);

  // After adding/deleting — refresh both datasets
  const handleDataChange = () => {
    fetchAllExpenses();
    fetchFilteredExpenses(selectedMonth, selectedYear);
  };

  // ─── Month selection handler ──────────────────────────────────────────────
  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // ─── Derived label ────────────────────────────────────────────────────────
  const monthLabel = selectedMonth && selectedYear
    ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
    : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg">
              💰
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Expense Tracker</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Track your personal finances</p>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Totals row */}
        {!loading && !fetchError && (
          <MonthlyTotal
            expenses={filteredExpenses}
            allExpenses={allExpenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        )}

        {/* Monthly breakdown cards */}
        {!loading && (
          <MonthlySummary
            allExpenses={allExpenses}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthSelect={handleMonthChange}
          />
        )}

        {/* Month filter dropdown */}
        {!loading && (
          <MonthFilter
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        )}

        {/* Error banner */}
        {fetchError && (
          <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-sm flex items-center gap-2">
            <span>⚠️</span> {fetchError}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Main grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Add form */}
            <div className="lg:col-span-1">
              <AddExpenseForm onExpenseAdded={handleDataChange} />
            </div>

            {/* Right: List + Chart + Insights */}
            <div className="lg:col-span-2 space-y-6">
              <ExpenseList
                expenses={filteredExpenses}
                onDeleted={handleDataChange}
                title={monthLabel}
              />
              <CategoryPieChart expenses={filteredExpenses} />
              <AIInsights
                expenses={filteredExpenses}
                allExpenses={allExpenses}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs text-slate-600 border-t border-slate-800 mt-4">
        MERN Expense Tracker · Built with React, Node.js, Express &amp; MongoDB
      </footer>
    </div>
  );
}
