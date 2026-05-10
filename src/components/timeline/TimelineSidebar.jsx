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
