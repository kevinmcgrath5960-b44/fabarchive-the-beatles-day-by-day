import React from 'react';

export default function StatsBar({ totalEvents }) {
  const stats = [
    { number: totalEvents || '—', label: 'Events Documented' },
    { number: '10', label: 'Years Covered' },
    { number: '4', label: 'Band Members' },
  ];

  return (
    <div style={{ background: '#F7F7F7', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5' }}>
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-wrap justify-center" style={{ gap: '48px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 500, color: '#111111', lineHeight: 1, marginBottom: '6px' }}>{s.number}</p>
            <p style={{ fontSize: '11px', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}