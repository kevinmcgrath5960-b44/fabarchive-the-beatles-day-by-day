import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Timeline', path: '/timeline' },
  { label: 'Members', path: '/members' },
  { label: 'Search', path: '/search' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full" style={{ background: '#111111' }}>
      <div style={{ borderBottom: '1px solid #C8102E' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: '52px' }}>
          {/* Left: site name */}
          <Link to="/" className="flex items-center gap-0 select-none" style={{ outline: 'none' }}>
            <span className="text-white font-semibold" style={{ fontSize: '16px' }}>The Beatles</span>
            <span style={{ width: '1px', height: '14px', background: '#444444', margin: '0 12px', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '16px', color: '#999999', fontWeight: 400 }}>Day by Day</span>
          </Link>

          {/* Right: nav links */}
          <div className="hidden md:flex items-center" style={{ gap: '0px' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '14px',
                  color: location.pathname === link.path ? '#C8102E' : '#FFFFFF',
                  padding: '0 16px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              style={{ padding: '0 12px', height: '52px', display: 'flex', alignItems: 'center', color: '#999999' }}
            >
              <Search size={15} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: '#111111', borderBottom: '1px solid #333333' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 24px',
                fontSize: '14px',
                color: location.pathname === link.path ? '#C8102E' : '#CCCCCC',
                borderBottom: '1px solid #222222',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}