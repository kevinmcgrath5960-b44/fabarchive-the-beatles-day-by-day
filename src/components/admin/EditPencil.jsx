import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

// Small pencil icon shown only to admins.
// Props:
//   to         — admin route to navigate to
//   returnTo   — path to come back to after saving (stored in router state)
//   style      — optional extra styles on the wrapper
//   title      — tooltip text

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
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        fontSize: '12px',
        lineHeight: 1,
        color: 'inherit',
        opacity: 0.3,
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'opacity 0.15s',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.3'}
    >
      ✏
    </Link>
  );
}
