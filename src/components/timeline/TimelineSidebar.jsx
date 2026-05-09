import React from 'react';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TimelineSidebar({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
  return (
    <aside className="w-full lg:w-48 shrink-0">
      <div className="sticky top-16">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Year</h3>
        <div className="flex flex-wrap lg:flex-col gap-1 mb-6">
          {YEARS.map(year => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-3 py-1.5 text-sm font-mono text-left rounded transition-colors ${
                selectedYear === year
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Month</h3>
        <div className="flex flex-wrap lg:flex-col gap-1">
          <button
            onClick={() => onMonthChange(null)}
            className={`px-3 py-1.5 text-sm text-left rounded transition-colors ${
              selectedMonth === null
                ? 'bg-accent text-accent-foreground font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          {MONTHS.map((month, idx) => (
            <button
              key={idx}
              onClick={() => onMonthChange(idx + 1)}
              className={`px-3 py-1.5 text-sm text-left rounded transition-colors ${
                selectedMonth === idx + 1
                  ? 'bg-accent text-accent-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}