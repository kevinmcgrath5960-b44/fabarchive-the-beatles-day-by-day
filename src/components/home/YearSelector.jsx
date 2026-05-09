import React from 'react';
import { Link } from 'react-router-dom';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);

export default function YearSelector() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {YEARS.map(year => (
        <Link
          key={year}
          to={`/timeline?year=${year}`}
          className="px-4 py-2 border border-border text-sm font-mono font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
        >
          {year}
        </Link>
      ))}
    </div>
  );
}