import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#111111', borderTop: '1px solid #222222' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-0 mb-3">
              <span className="text-white font-semibold" style={{ fontSize: '15px' }}>The Beatles</span>
              <span style={{ width: '1px', height: '12px', background: '#444444', margin: '0 10px', display: 'inline-block' }} />
              <span style={{ fontSize: '15px', color: '#666666' }}>Day by Day</span>
            </div>
            <p style={{ fontSize: '13px', color: '#666666', lineHeight: '1.6' }}>
              An encyclopaedic chronicle covering every recording session, performance, and milestone from 1962 to 1971.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#444444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Archive</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Timeline', 'Members', 'Search'].map(label => (
                <Link
                  key={label}
                  to={`/${label.toLowerCase()}`}
                  style={{ fontSize: '13px', color: '#888888', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#FFFFFF'}
                  onMouseLeave={e => e.target.style.color = '#888888'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#444444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Years</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Array.from({ length: 10 }, (_, i) => 1962 + i).map(year => (
                <Link
                  key={year}
                  to={`/timeline?year=${year}`}
                  style={{ fontSize: '13px', color: '#666666', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#C8102E'}
                  onMouseLeave={e => e.target.style.color = '#666666'}
                >
                  {year}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #222222', fontSize: '12px', color: '#444444' }}>
          Fan-made historical archive. Not affiliated with Apple Corps Ltd.
        </div>
      </div>
    </footer>
  );
}