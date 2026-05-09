import React from 'react';

export default function MemberBadge({ name }) {
  return (
    <span style={{
      fontSize: '11px',
      color: '#666666',
      border: '1px solid #E5E5E5',
      padding: '2px 7px',
      borderRadius: '3px',
      display: 'inline-block',
      background: '#FAFAFA',
    }}>
      {name}
    </span>
  );
}