const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthFilter({ selectedMonth, selectedYear, onMonthChange }) {
  const now = new Date();

  // Build a list of the last 12 months (newest first) for the dropdown
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push({ month: d.getMonth() + 1, year: d.getFullYear() });
  }

  const currentValue =
    selectedMonth && selectedYear ? `${selectedMonth}-${selectedYear}` : '';

  const handleChange = (e) => {
    const val = e.target.value;
    if (!val) {
      onMonthChange(null, null);
    } else {
      const [m, y] = val.split('-').map(Number);
      onMonthChange(m, y);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-medium text-slate-400 shrink-0">Filter by month:</span>

      <select
        value={currentValue}
        onChange={handleChange}
        className="bg-slate-800 border border-slate-600 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
      >
        <option value="">All Months</option>
        {monthOptions.map(({ month, year }) => (
          <option key={`${month}-${year}`} value={`${month}-${year}`}>
            {MONTHS[month - 1]} {year}
          </option>
        ))}
      </select>

      {/* Clear filter button */}
      {selectedMonth && (
        <button
          onClick={() => onMonthChange(null, null)}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
