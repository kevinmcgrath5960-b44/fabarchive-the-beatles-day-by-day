import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { usePhase } from '@/lib/PhaseContext';

const NAV_LINKS = [
  { label: 'Timeline', path: '/timeline' },
  { label: 'Members', path: '/members' },
  { label: 'Search', path: '/search' },
];

// Per-phase navbar palette — mirrors --phase-header-* CSS vars
const PHASE_NAVBAR = {
  archive:      { bg: '#1A1614', ink: '#F4ECDC', accent: '#A8231C', border: '#A8231C',  muted: '#8a7e6f' },
  transitional: { bg: '#2A1D14', ink: '#EFE2C8', accent: '#C46A3A', border: '#C46A3A',  muted: '#7a6a55' },
  moptop:       { bg: '#0E0E0E', ink: '#F5F5F0', accent: '#C8102E', border: '#C8102E',  muted: '#6a6a65' },
  psychedelic:  { bg: '#1F0A1F', ink: '#FCC419', accent: '#ED1C24', border: '#FCC419',  muted: '#a08030' },
  bohemian:     { bg: '#1a1814', ink: '#F1ECE3', accent: '#3E5C3A', border: '#3E5C3A',  muted: '#9a9285' },
};

const DEFAULT = { bg: '#111111', ink: '#FFFFFF', accent: '#C8102E', border: '#C8102E', muted: '#999999' };

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { phaseId } = usePhase();

  const colors = (phaseId && PHASE_NAVBAR[phaseId]) || DEFAULT;

  return (
    <nav className="w-full" style={{ background: colors.bg, transition: 'background 0.5s ease' }}>
      <div style={{ borderBottom: `1px solid ${colors.border}`, transition: 'border-color 0.5s ease' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: '52px' }}>

          {/* Site name */}
          <Link to="/" className="flex items-center select-none" style={{ outline: 'none', textDecoration: 'none' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: colors.ink, transition: 'color 0.5s' }}>
              The Beatles
            </span>
            <span style={{
              width: '1px', height: '14px',
              background: colors.muted,
              margin: '0 12px', display: 'inline-block', flexShrink: 0,
              transition: 'background 0.5s',
            }} />
            <span style={{ fontSize: '16px', color: colors.muted, fontWeight: 400, transition: 'color 0.5s' }}>
              Day by Day
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '14px',
                  color: location.pathname === link.path ? colors.accent : colors.ink,
                  padding: '0 16px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  opacity: location.pathname === link.path ? 1 : 0.75,
                  transition: 'color 0.3s, opacity 0.3s',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              style={{
                padding: '0 12px', height: '52px', display: 'flex',
                alignItems: 'center', color: colors.muted,
                transition: 'color 0.5s',
              }}
            >
              <Search size={15} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.ink, padding: '4px' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: colors.bg }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 24px',
                fontSize: '14px',
                color: location.pathname === link.path ? colors.accent : colors.ink,
                borderBottom: `1px solid ${colors.muted}44`,
                textDecoration: 'none',
                opacity: location.pathname === link.path ? 1 : 0.8,
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
