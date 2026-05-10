import React from 'react';
import { PHASES, PHASE_FOR_YEAR } from '@/lib/phases';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Phase identification dot colours (shown next to each year in the list)
const PHASE_DOT = {
  archive:      '#A8231C',
  transitional: '#C46A3A',
  moptop:       '#C8102E',
  psychedelic:  '#FCC419',
  bohemian:     '#3E5C3A',
};

export default function TimelineSidebar({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
  const phase = PHASES[PHASE_FOR_YEAR[selectedYear] ?? 'archive'];

  return (
    // The sidebar sits INSIDE the .phase-{id} root in Timeline.jsx,
    // so all var(--phase-sb-*) tokens are available here.
    <aside style={{
      width: '210px',
      flexShrink: 0,
      background: 'var(--phase-sb-bg)',
      borderRight: '1px solid var(--phase-sb-muted)',
      minHeight: '100vh',
      transition: 'background 0.4s ease',
    }}>
      <div style={{ position: 'sticky', top: '52px' }}>

        {/* ── Volume block ─────────────────────────────────────────────── */}
        <div style={{
          padding: '28px 20px 18px',
          borderBottom: '1px solid var(--phase-sb-muted)',
        }}>
          <p style={{
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--phase-sb-muted)',
            marginBottom: '6px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}>
            Volume
          </p>
          <p style={{
            fontFamily: phase.fonts.display,
            fontSize: '48px',
            fontWeight: phase.weights.display,
            color: 'var(--phase-sb-ink)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}>
            {selectedYear}
          </p>
          <p style={{
            fontSize: '9px',
            color: 'var(--phase-sb-accent)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
          }}>
            {phase.label}
          </p>
        </div>

        {/* ── Year selector ─────────────────────────────────────────────── */}
        <div style={{ paddingTop: '14px', paddingBottom: '6px' }}>
          <p style={{
            fontSize: '9px',
            color: 'var(--phase-sb-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            paddingLeft: '18px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}>Year</p>

          {YEARS.map(year => {
            const isActive = selectedYear === year;
            const dotColor = PHASE_DOT[PHASE_FOR_YEAR[year] ?? 'archive'];
            return (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  width: '100%',
                  padding: '5px 18px',
                  fontSize: '13px',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--phase-sb-ink)' : 'var(--phase-sb-muted)',
                  background: 'none',
                  border: 'none',
                  borderLeft: `2px solid ${isActive ? 'var(--phase-sb-accent)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--phase-sb-ink)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--phase-sb-muted)'; }}
              >
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.45,
                  transition: 'opacity 0.15s',
                }} />
                {year}
              </button>
            );
          })}
        </div>

        {/* ── Month chips ───────────────────────────────────────────────── */}
        <div style={{ padding: '16px 18px 28px' }}>
          <p style={{
            fontSize: '9px',
            color: 'var(--phase-sb-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
          }}>Month</p>

          {/* All months */}
          <button
            onClick={() => onMonthChange(null)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '5px 10px',
              marginBottom: '8px',
              fontSize: '11px',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.04em',
              background: selectedMonth === null ? 'var(--phase-sb-accent)' : 'transparent',
              color: selectedMonth === null ? 'var(--phase-sb-bg)' : 'var(--phase-sb-muted)',
              border: `1px solid ${selectedMonth === null ? 'var(--phase-sb-accent)' : 'var(--phase-sb-muted)'}`,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            All months
          </button>

          {/* Month grid 3×4 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {MONTHS.map((month, idx) => {
              const isActive = selectedMonth === idx + 1;
              return (
                <button
                  key={idx}
                  onClick={() => onMonthChange(idx + 1)}
                  style={{
                    padding: '5px 2px',
                    fontSize: '10px',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.03em',
                    textAlign: 'center',
                    background: isActive ? 'var(--phase-sb-accent)' : 'transparent',
                    color: isActive ? 'var(--phase-sb-bg)' : 'var(--phase-sb-muted)',
                    border: `1px solid ${isActive ? 'var(--phase-sb-accent)' : 'var(--phase-sb-muted)'}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--phase-sb-ink)'; e.currentTarget.style.borderColor = 'var(--phase-sb-ink)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--phase-sb-muted)'; e.currentTarget.style.borderColor = 'var(--phase-sb-muted)'; }}}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
