import React from 'react';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TimelineSidebar({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
  return (
    <aside style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #E5E5E5', paddingRight: '0' }}>
      <div style={{ position: 'sticky', top: '52px', paddingTop: '24px' }}>
        <p style={{ fontSize: '11px', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '16px' }}>Year</p>
        <div style={{ marginBottom: '24px' }}>
          {YEARS.map(year => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 16px',
                fontSize: '14px',
                color: selectedYear === year ? '#111111' : '#666666',
                background: 'none',
                border: 'none',
                borderLeft: selectedYear === year ? '3px solid #C8102E' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: selectedYear === year ? 500 : 400,
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => { if (selectedYear !== year) e.currentTarget.style.color = '#111111'; }}
              onMouseLeave={e => { if (selectedYear !== year) e.currentTarget.style.color = '#666666'; }}
            >
              {year}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '11px', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '16px' }}>Month</p>
        <div>
          <button
            onClick={() => onMonthChange(null)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 16px', fontSize: '14px',
              color: selectedMonth === null ? '#111111' : '#666666',
              background: 'none', border: 'none',
              borderLeft: selectedMonth === null ? '3px solid #C8102E' : '3px solid transparent',
              cursor: 'pointer', fontWeight: selectedMonth === null ? 500 : 400,
            }}
          >
            All Months
          </button>
          {MONTHS.map((month, idx) => (
            <button
              key={idx}
              onClick={() => onMonthChange(idx + 1)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 16px', fontSize: '14px',
                color: selectedMonth === idx + 1 ? '#111111' : '#666666',
                background: 'none', border: 'none',
                borderLeft: selectedMonth === idx + 1 ? '3px solid #C8102E' : '3px solid transparent',
                cursor: 'pointer', fontWeight: selectedMonth === idx + 1 ? 500 : 400,
              }}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}