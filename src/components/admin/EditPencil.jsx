import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function EditPencil({ to, returnTo, style, title = 'Edit' }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;

  return (
    <Link
      to={to}
      state={{ returnTo: returnTo || (window.location.pathname + window.location.search) }}
      title={title}
      onClick={e => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        fontSize: '10px',
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#C8102E',
        background: 'rgba(200, 16, 46, 0.08)',
        border: '1px solid rgba(200, 16, 46, 0.3)',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#C8102E';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.borderColor = '#C8102E';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(200, 16, 46, 0.08)';
        e.currentTarget.style.color = '#C8102E';
        e.currentTarget.style.borderColor = 'rgba(200, 16, 46, 0.3)';
      }}
    >
      ✏ Edit
    </Link>
  );
}
