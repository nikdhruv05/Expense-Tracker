import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  Food:     '#10b981',
  Travel:   '#38bdf8',
  Shopping: '#a78bfa',
  Bills:    '#fbbf24',
  Other:    '#fb7185',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm shadow-xl">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-slate-300">₹{value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ expenses }) {
  // Aggregate spending by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col items-center justify-center min-h-[280px]">
        <div className="text-4xl mb-3">🥧</div>
        <p className="text-slate-400 text-sm">No data to display yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <span className="text-2xl">🥧</span> Spending by Category
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category breakdown list */}
      <div className="mt-4 space-y-2">
        {data.map((item) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[item.name] || '#94a3b8' }}
                />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs">{pct}%</span>
                <span className="text-white font-semibold">
                  ₹{item.value.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
