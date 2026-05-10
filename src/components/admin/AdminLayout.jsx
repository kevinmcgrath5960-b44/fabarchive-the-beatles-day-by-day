import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Image, FileText, Users, Settings } from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Events', path: '/admin', icon: Calendar },
  { label: 'Photos', path: '/admin/photos', icon: Image },
  { label: 'Overviews', path: '/admin/overviews', icon: FileText },
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside style={{ width: '200px', flexShrink: 0, background: '#111111', display: 'flex', flexDirection: 'column' }} className="hidden md:flex">
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #222222' }}>
          <Link to="/" style={{ fontSize: '12px', color: '#666666', textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
            ← Back to site
          </Link>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>Admin</p>
        </div>
        <nav style={{ padding: '8px 0', flex: 1 }}>
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 16px', fontSize: '13px', textDecoration: 'none',
                  color: active ? '#FFFFFF' : '#888888',
                  background: active ? '#222222' : 'transparent',
                  borderLeft: active ? '3px solid #C8102E' : '3px solid transparent',
                  transition: 'color 0.1s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#CCCCCC'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#888888'; }}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div style={{ flex: 1, background: '#FFFFFF', overflow: 'auto' }}>
        {/* Mobile top nav */}
        <div className="md:hidden" style={{ background: '#111111', padding: '0 12px', display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid #C8102E' }}>
          {ADMIN_NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '12px 12px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap',
                  color: active ? '#C8102E' : '#888888',
                  borderBottom: active ? '2px solid #C8102E' : '2px solid transparent',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}