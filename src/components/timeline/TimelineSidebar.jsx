import React from 'react';
import { PHASES, PHASE_FOR_YEAR } from '@/lib/phases';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PHASE_DOT = {
  archive:      '#A8231C',
  transitional: '#C46A3A',
  moptop:       '#C8102E',
  psychedelic:  '#FCC419',
  bohemian:     '#3E5C3A',
};

const MAIN_MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr'];

const labelStyle = {
  fontSize: '9px',
  color: 'var(--phase-sb-muted)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: '"Inter", sans-serif',
  fontWeight: 500,
  marginBottom: '8px',
};

export default function TimelineSidebar({
  selectedYear, selectedMonth, onYearChange, onMonthChange,
  member, onMemberChange,
}) {
  const phase = PHASES[PHASE_FOR_YEAR[selectedYear] ?? 'archive'];

  return (
    <aside style={{
      width: '210px',
      flexShrink: 0,
      background: 'var(--phase-sb-bg)',
      borderRight: '1px solid var(--phase-sb-muted)',
      minHeight: '100vh',
      transition: 'background 0.4s ease',
    }}>
      <div style={{ position: 'sticky', top: '52px', overflowY: 'auto', maxHeight: 'calc(100vh - 52px)' }}>

        {/* ── Volume block ─────────────────────────────────────────────── */}
        <div style={{
          padding: '28px 20px 18px',
          borderBottom: '1px solid var(--phase-sb-muted)',
        }}>
          <p style={{ ...labelStyle, marginBottom: '6px' }}>Volume</p>
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

        {/* ── Years ────────────────────────────────────────────────────── */}
        <div style={{ paddingTop: '16px', paddingBottom: '8px' }}>
          <p style={{ ...labelStyle, paddingLeft: '18px' }}>Years</p>
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
                  textAlign: 'left',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--phase-sb-ink)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--phase-sb-muted)'; }}
              >
                <span style={{
                  width: '5px', height: '5px',
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.45,
                }} />
                {year}
              </button>
            );
          })}
        </div>

        {/* ── Chapters (months) ─────────────────────────────────────────── */}
        <div style={{
          padding: '16px 18px 20px',
          borderTop: '1px solid var(--phase-sb-muted)',
        }}>
          <p style={labelStyle}>Chapters</p>

          {/* All months — returns to year overview */}
          <button
            onClick={() => onMonthChange(null)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '4px 0',
              marginBottom: '10px',
              fontSize: '12px',
              fontFamily: phase.fonts.body,
              fontStyle: 'italic',
              color: selectedMonth === null ? 'var(--phase-sb-accent)' : 'var(--phase-sb-ink)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: selectedMonth === null ? 600 : 400,
              transition: 'color 0.15s',
            }}
          >
            All twelve months
          </button>

          {/* Month chip grid 3×4 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {MONTHS.map((mon, idx) => {
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
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--phase-sb-ink)'; e.currentTarget.style.borderColor = 'var(--phase-sb-ink)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--phase-sb-muted)'; e.currentTarget.style.borderColor = 'var(--phase-sb-muted)'; } }}
                >
                  {mon}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Figures (member filter) ───────────────────────────────────── */}
        <div style={{
          padding: '16px 18px 28px',
          borderTop: '1px solid var(--phase-sb-muted)',
        }}>
          <p style={labelStyle}>Figures</p>
          {MAIN_MEMBERS.map(name => {
            const isActive = member === name;
            return (
              <button
                key={name}
                onClick={() => onMemberChange(isActive ? null : name)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '4px 0',
                  fontSize: '12px',
                  fontFamily: phase.fonts.body,
                  fontStyle: 'italic',
                  color: isActive ? 'var(--phase-sb-accent)' : 'var(--phase-sb-ink)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 400,
                  opacity: isActive ? 1 : 0.75,
                  transition: 'color 0.15s, opacity 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--phase-sb-ink)'; }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.color = 'var(--phase-sb-ink)'; } }}
              >
                {name}
              </button>
            );
          })}
        </div>

      </div>
    </aside>
  );
}
