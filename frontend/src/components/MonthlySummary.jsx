const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function MonthlySummary({ allExpenses, selectedMonth, selectedYear, onMonthSelect }) {
  // Group allExpenses by "month-year" key
  const grouped = allExpenses.reduce((acc, expense) => {
    const d = new Date(expense.date);
    const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
    if (!acc[key]) {
      acc[key] = { month: d.getMonth() + 1, year: d.getFullYear(), total: 0, count: 0 };
    }
    acc[key].total += expense.amount;
    acc[key].count += 1;
    return acc;
  }, {});

  // Sort newest first
  const summaryList = Object.values(grouped).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });

  if (summaryList.length === 0) {
    return null; // Nothing to show yet
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span>📅</span> Monthly Breakdown
        <span className="ml-auto text-xs font-normal text-slate-400">Click a card to filter</span>
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {summaryList.map(({ month, year, total, count }) => {
          const isActive = selectedMonth === month && selectedYear === year;
          return (
            <button
              key={`${month}-${year}`}
              onClick={() => onMonthSelect(isActive ? null : month, isActive ? null : year)}
              className={`shrink-0 rounded-xl px-4 py-3 text-left transition-all duration-200 border
                ${isActive
                  ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/40'
                  : 'bg-slate-900 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
                }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                {MONTHS[month - 1]} {year}
              </p>
              <p className={`text-lg font-extrabold ${isActive ? 'text-white' : 'text-white'}`}>
                ₹{total.toLocaleString('en-IN')}
              </p>
              <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                {count} expense{count !== 1 ? 's' : ''}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
