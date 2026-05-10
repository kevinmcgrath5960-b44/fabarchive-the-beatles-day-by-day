import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import TimelineSidebar from '../components/timeline/TimelineSidebar';
import FilterBar from '../components/timeline/FilterBar';
import EventTypeBadge from '../components/shared/EventTypeBadge';
import { getPhaseForYear, YEAR_IN_WORDS, YEAR_SUBTITLES } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// ── Phase decoration divider ──────────────────────────────────────────────────
function PhaseDecoration({ decoration, mmtPalette }) {
  if (decoration === 'asterisks') {
    return (
      <div style={{
        textAlign: 'center',
        margin: '24px 0',
        color: 'var(--phase-accent)',
        fontSize: '16px',
        letterSpacing: '16px',
        opacity: 0.8,
      }}>
        ✦ ✦ ✦ ✦ ✦
      </div>
    );
  }
  if (decoration === 'rainbow') {
    const palette = mmtPalette || ['#FCC419', '#E37817', '#46BDE0', '#8FBFDB', '#ED1C24'];
    return (
      <div style={{ display: 'flex', height: '5px', margin: '24px 0' }}>
        {palette.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
    );
  }
  if (decoration === 'rule') {
    return <div style={{ height: '1px', background: 'var(--phase-accent)', margin: '24px 0', opacity: 0.5 }} />;
  }
  // 'line' and default
  return <div style={{ height: '2px', background: 'var(--phase-accent)', margin: '24px 0', opacity: 0.7 }} />;
}

// ── Single event row ──────────────────────────────────────────────────────────
function EventRow({ event, phase }) {
  const [hovered, setHovered] = useState(false);

  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : event.date ? format(new Date(event.date), 'd MMM') : '';

  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '70px 1fr auto',
          gap: '16px',
          alignItems: 'center',
          padding: '11px 0 11px 12px',
          borderBottom: '1px solid var(--phase-surface)',
          borderLeft: `2px solid ${hovered ? 'var(--phase-accent)' : 'transparent'}`,
          transition: 'border-color 0.15s',
          marginLeft: '-14px',
        }}
      >
        {/* Date stamp */}
        <div style={{ flexShrink: 0 }}>
          <span style={{
            fontSize: '11px',
            fontFamily: phase.fonts.mono,
            color: 'var(--phase-muted)',
            lineHeight: 1.3,
            display: 'block',
          }}>
            {dateStr}
          </span>
        </div>

        {/* Title + excerpt */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: phase.weights.body,
            fontFamily: phase.fonts.body,
            color: hovered ? 'var(--phase-accent)' : 'var(--phase-ink)',
            lineHeight: 1.35,
            marginBottom: event.body ? '2px' : 0,
            transition: 'color 0.15s',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {event.title}
          </h3>
          {event.body && (
            <p style={{
              fontSize: '11px',
              color: 'var(--phase-muted)',
              lineHeight: 1.4,
              fontFamily: '"Inter", sans-serif',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}>
              {event.body.substring(0, 130)}
            </p>
        