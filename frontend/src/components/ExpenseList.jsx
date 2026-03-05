import { deleteExpense } from '../api/expenseApi';

const CATEGORY_BADGES = {
  Food:     'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Travel:   'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Shopping: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  Bills:    'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Other:    'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const CATEGORY_ICONS = {
  Food: '🍔',
  Travel: '✈️',
  Shopping: '🛍️',
  Bills: '💡',
  Other: '📦',
};

export default function ExpenseList({ expenses, onDeleted, title }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      onDeleted();
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700 text-center">
        <div className="text-5xl mb-3">💸</div>
        <p className="text-slate-400 text-sm">
          {title ? `No expenses found for ${title}.` : 'No expenses yet. Add your first one!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className="text-2xl">📋</span> {title ? `${title} Expenses` : 'All Expenses'}
        <span className="ml-auto text-xs font-normal bg-slate-700 text-slate-400 px-2.5 py-1 rounded-full">
          {expenses.length} item{expenses.length !== 1 ? 's' : ''}
        </span>
      </h2>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 group transition-all duration-200"
          >
            {/* Left: icon + info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-xl shrink-0">{CATEGORY_ICONS[expense.category] || '📦'}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{expense.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_BADGES[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: amount + delete */}
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <span className="text-sm font-bold text-white">
                ₹{expense.amount.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => handleDelete(expense._id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                title="Delete expense"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
