import React from 'react';
import { Link } from 'react-router-dom';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);

export default function YearSelector() {
  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '6px', overflowX: 'auto' }}>
      {YEARS.map(year => (
        <Link
          key={year}
          to={`/timeline?year=${year}`}
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            fontSize: '13px',
            color: '#111111',
            border: '1px solid #CCCCCC',
            background: '#FFFFFF',
            textDecoration: 'none',
            borderRadius: '2px',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { e.target.style.background = '#111111'; e.target.style.color = '#FFFFFF'; e.target.style.borderColor = '#111111'; }}
          onMouseLeave={e => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#111111'; e.target.style.borderColor = '#CCCCCC'; }}
        >
          {year}
        </Link>
      ))}
    </div>
  );
}