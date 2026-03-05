import { useMemo } from 'react';

// ─── Insight Engine ───────────────────────────────────────────────────────────
// Pure rule-based analysis — runs entirely in the browser, no API needed.

const CATEGORY_TIPS = {
  Food:     'Try meal-prepping or cooking at home more often to cut costs.',
  Travel:   'Consider carpooling, public transit, or planning trips in advance for better rates.',
  Shopping: 'Try a 24-hour rule before non-essential purchases — it reduces impulse buying.',
  Bills:    'Review your subscriptions and negotiate utility rates to lower fixed costs.',
  Other:    'Track what falls under "Other" more closely to find hidden savings.',
};

const CATEGORY_ICONS = {
  Food: '🍔', Travel: '✈️', Shopping: '🛍️', Bills: '💡', Other: '📦',
};

const INSIGHT_LEVELS = {
  warning: {
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge:  'bg-amber-500/20 text-amber-300',
    dot:    'bg-amber-400',
    text:   'text-amber-100',
    sub:    'text-amber-300/70',
  },
  info: {
    bg:     'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge:  'bg-sky-500/20 text-sky-300',
    dot:    'bg-sky-400',
    text:   'text-sky-100',
    sub:    'text-sky-300/70',
  },
  success: {
    bg:     'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge:  'bg-emerald-500/20 text-emerald-300',
    dot:    'bg-emerald-400',
    text:   'text-emerald-100',
    sub:    'text-emerald-300/70',
  },
  danger: {
    bg:     'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge:  'bg-rose-500/20 text-rose-300',
    dot:    'bg-rose-400',
    text:   'text-rose-100',
    sub:    'text-rose-300/70',
  },
};

function generateInsights(expenses, allExpenses, selectedMonth, selectedYear) {
  if (!expenses || expenses.length === 0) return [];

  const insights = [];
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // ── 1. Category breakdown ─────────────────────────────────────────────────
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const [topCat, topAmt] = sorted[0] || [];
  const topPct = total > 0 ? Math.round((topAmt / total) * 100) : 0;

  if (topCat && topPct >= 40) {
    insights.push({
      level: 'warning',
      icon: CATEGORY_ICONS[topCat] || '📊',
      label: 'High Category Spend',
      message: `You spent ${topPct}% of your budget on ${topCat} this period (₹${topAmt.toLocaleString('en-IN')}).`,
      tip: CATEGORY_TIPS[topCat],
    });
  } else if (topCat && topPct >= 30) {
    insights.push({
      level: 'info',
      icon: CATEGORY_ICONS[topCat] || '📊',
      label: 'Top Category',
      message: `${topCat} is your largest expense category at ${topPct}% of total spend.`,
      tip: CATEGORY_TIPS[topCat],
    });
  }

  // ── 2. Discretionary vs essential spend ───────────────────────────────────
  const discretionary = (byCategory['Shopping'] || 0) + (byCategory['Other'] || 0);
  const discPct = total > 0 ? Math.round((discretionary / total) * 100) : 0;
  if (discPct >= 35) {
    insights.push({
      level: 'warning',
      icon: '🛒',
      label: 'Discretionary Spend',
      message: `${discPct}% of your spending (₹${discretionary.toLocaleString('en-IN')}) is on non-essential items (Shopping + Other).`,
      tip: 'Set a monthly discretionary budget cap to avoid overspending.',
    });
  }

  // ── 3. Single largest expense ─────────────────────────────────────────────
  const biggest = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
  const biggestPct = total > 0 ? Math.round((biggest.amount / total) * 100) : 0;
  if (biggestPct >= 25) {
    insights.push({
      level: 'info',
      icon: '💸',
      label: 'Large Single Expense',
      message: `"${biggest.title}" accounts for ${biggestPct}% of this period's spend at ₹${biggest.amount.toLocaleString('en-IN')}.`,
      tip: 'Large one-off expenses can skew your monthly averages — consider tracking them separately.',
    });
  }

  // ── 4. Balanced spending (positive insight) ───────────────────────────────
  if (sorted.length >= 3 && topPct < 35) {
    insights.push({
      level: 'success',
      icon: '⚖️',
      label: 'Balanced Spending',
      message: `Your spending is well-distributed! No single category exceeds 35% of your total.`,
      tip: "Keep maintaining diverse spending — it's a sign of healthy financial habits.",
    });
  }

  // ── 5. Month-over-month comparison ────────────────────────────────────────
  if (allExpenses.length > 0 && selectedMonth && selectedYear) {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

    const prevExpenses = allExpenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === prevMonth && d.getFullYear() === prevYear;
    });
    const prevTotal = prevExpenses.reduce((s, e) => s + e.amount, 0);

    if (prevTotal > 0) {
      const diff    = total - prevTotal;
      const diffPct = Math.round(Math.abs(diff / prevTotal) * 100);
      if (diff > 0 && diffPct >= 15) {
        insights.push({
          level: 'danger',
          icon: '📈',
          label: 'Spending Increased',
          message: `You spent ${diffPct}% more than last month (₹${Math.abs(diff).toLocaleString('en-IN')} extra).`,
          tip: 'Review new recurring expenses or one-time splurges that drove the increase.',
        });
      } else if (diff < 0 && diffPct >= 10) {
        insights.push({
          level: 'success',
          icon: '📉',
          label: 'Spending Decreased',
          message: `Great job! You spent ${diffPct}% less than last month, saving ₹${Math.abs(diff).toLocaleString('en-IN')}.`,
          tip: 'Keep up the discipline — consider moving the saved amount to savings.',
        });
      }
    }
  }

  // ── 6. Average per expense ────────────────────────────────────────────────
  const avg = Math.round(total / expenses.length);
  if (avg > 2000) {
    insights.push({
      level: 'info',
      icon: '🔢',
      label: 'High Average Expense',
      message: `Your average expense this period is ₹${avg.toLocaleString('en-IN')} — above the typical ₹2,000 benchmark.`,
      tip: 'Look for smaller daily expenses that add up, like subscriptions or dining.',
    });
  }

  return insights.slice(0, 4); // Max 4 insights
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIInsights({ expenses, allExpenses, selectedMonth, selectedYear }) {
  const insights = useMemo(
    () => generateInsights(expenses, allExpenses, selectedMonth, selectedYear),
    [expenses, allExpenses, selectedMonth, selectedYear]
  );

  if (insights.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🤖</span> AI Insights
        </h2>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🧠</div>
          <p className="text-slate-400 text-sm">Add more expenses to unlock spending insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🤖</span> AI Insights
        </h2>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-medium">
          {insights.length} insight{insights.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const s = INSIGHT_LEVELS[insight.level];
          return (
            <div
              key={i}
              className={`${s.bg} border ${s.border} rounded-xl p-4 transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                {/* Emoji icon */}
                <div className="text-2xl shrink-0 mt-0.5">{insight.icon}</div>

                <div className="flex-1 min-w-0">
                  {/* Badge + label */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                      {insight.label}
                    </span>
                  </div>

                  {/* Main message */}
                  <p className={`text-sm font-medium ${s.text} leading-snug`}>
                    {insight.message}
                  </p>

                  {/* Tip */}
                  {insight.tip && (
                    <p className={`text-xs mt-1.5 ${s.sub} leading-relaxed`}>
                      💡 {insight.tip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 mt-4 text-center">
        Insights are generated locally based on your spending patterns
      </p>
    </div>
  );
}
