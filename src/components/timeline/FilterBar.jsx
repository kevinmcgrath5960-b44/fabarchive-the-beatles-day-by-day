import React from 'react';

const EVENT_TYPES = ['Recording Session', 'Live Performance', 'Business/Management', 'Apple Corps', 'Solo Work', 'Personal', 'Release', 'Media Appearance', 'Travel'];
const MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr', 'Pete Best', 'Stuart Sutcliffe'];

const selectStyle = {
  fontSize: '13px',
  color: '#111111',
  border: '1px solid #CCCCCC',
  background: '#FFFFFF',
  padding: '5px 10px',
  outline: 'none',
  cursor: 'pointer',
  borderRadius: '0',
  height: '30px',
};

export default function FilterBar({ eventType, member, onEventTypeChange, onMemberChange }) {
  const hasFilters = eventType || member;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <span style={{ fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '4px' }}>Filter:</span>

      <select value={eventType || ''} onChange={e => onEventTypeChange(e.target.value || null)} style={selectStyle}>
        <option value="">All Types</option>
        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <select value={member || ''} onChange={e => onMemberChange(e.target.value || null)} style={selectStyle}>
        <option value="">All Members</option>
        {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      {hasFilters && (
        <button
          onClick={() => { onEventTypeChange(null); onMemberChange(null); }}
          style={{
            fontSize: '12px', color: '#666666', background: 'none',
            border: '1px solid #E5E5E5', padding: '5px 10px', cursor: 'pointer', height: '30px',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#111111'}
          onMouseLeave={e => e.currentTarget.style.color = '#666666'}
        >
          × Clear
        </button>
      )}
    </div>
  );
}