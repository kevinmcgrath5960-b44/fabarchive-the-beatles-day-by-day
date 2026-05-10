import React from 'react';

const EVENT_TYPES = [
  'Recording Session', 'Live Performance', 'Business/Management',
  'Apple Corps', 'Solo Work', 'Personal', 'Release', 'Media Appearance', 'Travel',
];
const MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr', 'Pete Best', 'Stuart Sutcliffe'];

// Styles use CSS custom properties so they adapt to whatever phase scope
// the component is rendered inside (.phase-{id}).
const getSelectStyle = () => ({
  fontSize: '12px',
  color: 'var(--phase-ink)',
  border: '1px solid var(--phase-muted)',
  background: 'var(--phase-surface)',
  padding: '4px 8px',
  outline: 'none',
  cursor: 'pointer',
  borderRadius: '0',
  height: '28px',
  fontFamily: '"Inter", sans-serif',
  letterSpacing: '0.02em',
});

export default function FilterBar({ eventType, member, onEventTypeChange, onMemberChange }) {
  const hasFilters = eventType || member;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <span style={{
        fontSize: '9px',
        color: 'var(--phase-muted)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginRight: '4px',
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
      }}>
        Filter:
      </span>

      <select
        value={eventType || ''}
        onChange={e => onEventTypeChange(e.target.value || null)}
        style={getSelectStyle()}
      >
        <option value="">All Types</option>
        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={member || ''}
        onChange={e => onMemberChange(e.target.value || null)}
        style={getSelectStyle()}
      >
        <option value="">All Members</option>
        {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      {hasFilters && (
        <button
          onClick={() => { onEventTypeChange(null); onMemberChange(null); }}
          style={{
            fontSize: '11px',
            color: 'var(--phase-muted)',
            background: 'none',
            border: '1px solid var(--phase-muted)',
            padding: '4px 10px',
            cursor: 'pointer',
            height: '28px',
            fontFamily: '"Inter", sans-serif',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--phase-ink)'; e.currentTarget.style.borderColor = 'var(--phase-ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--phase-muted)'; e.currentTarget.style.borderColor = 'var(--phase-muted)'; }}
        >
          × Clear
        </button>
      )}
    </div>
  );
}
