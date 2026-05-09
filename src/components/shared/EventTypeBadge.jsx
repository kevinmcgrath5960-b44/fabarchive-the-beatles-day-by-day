import React from 'react';

export default function EventTypeBadge({ type }) {
  if (!type) return null;
  return (
    <span style={{
      fontSize: '11px',
      color: '#666666',
      border: '1px solid #CCCCCC',
      padding: '2px 7px',
      borderRadius: '3px',
      display: 'inline-block',
      letterSpacing: '0.01em',
      background: '#FFFFFF',
    }}>
      {type}
    </span>
  );
}