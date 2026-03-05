const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlyTotal({ expenses, allExpenses, selectedMonth, selectedYear }) {
  // Totals for the filtered/displayed expenses
  const filteredTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const allTimeTotal  = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Label for the left card
  const leftLabel = selectedMonth && selectedYear
    ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
    : new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Selected / current month total */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 shadow-xl shadow-indigo-900/40">
        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
          {leftLabel}
        </p>
        <p className="text-3xl font-extrabold text-white">
          ₹{filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-indigo-300 text-xs mt-1">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          {selectedMonth ? ' this month' : ' shown'}
        </p>
      </div>

      {/* All-time total — always from full dataset */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-5 shadow-xl border border-slate-600">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
          All Time Total
        </p>
        <p className="text-3xl font-extrabold text-white">
          ₹{allTimeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          {allExpenses.length} total expense{allExpenses.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
