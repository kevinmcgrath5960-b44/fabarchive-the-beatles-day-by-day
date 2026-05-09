import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function shortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function longDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`.toUpperCase();
}

export default function Home() {
  const today = new Date();
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');

  const [selectedYear, setSelectedYear] = useState(1963);
  const [selectedMonth, setSelectedMonth] = useState(1); // 0-indexed, Feb by default
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [] } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  const { data: overviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  const onThisDayEvents = useMemo(() =>
    events.filter(e => e.date &&
      e.date.substring(5, 7) === todayMonth &&
      e.date.substring(8, 10) === todayDay
    ), [events, todayMonth, todayDay]
  );

  const monthEvents = useMemo(() =>
    events.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    }).sort((a, b) => a.date.localeCompare(b.date)),
    [events, selectedYear, selectedMonth]
  );

  const displayEvent = selectedEvent || (monthEvents.length > 0 ? monthEvents[0] : null);
  const currentOverview = overviews.find(o => o.year === selectedYear && o.month === selectedMonth + 1);

  const handleYearChange = (year) => { setSelectedYear(year); setSelectedEvent(null); };
  const handleMonthChange = (idx) => { setSelectedMonth(idx); setSelectedEvent(null); };

  return (
    <div style={{ minHeight: '100vh', background: '#111111' }}>

      {/* ── Editorial Header ─────────────────────────────── */}
      <div style={{ background: '#191919' }}>
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-0">

          {/* Title block */}
          <p style={{ fontSize: '11px', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>
            The Complete Historical Record
          </p>
          <h1 style={{ fontSize: '46px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            The Beatles —<br />
            <span style={{ borderBottom: '3px solid #C8102E', paddingBottom: '3px' }}>Day by Day</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.65, maxWidth: '500px', marginBottom: '28px' }}>
            Every performance, recording session, press conference, and milestone from 1962 to 1971 — documented day by day.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '36px', alignItems: 'center', paddingBottom: '28px', borderBottom: '1px solid #2a2a2a' }}>
            {[
              { num: '120', label: 'Monthly Files' },
              { num: '10', label: 'Years' },
              { num: '295k', label: 'Words of History' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{s.num}</span>
                <span style={{ fontSize: '11px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Year nav */}
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', marginTop: '8px' }}>
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: selectedYear === year ? 600 : 400,
                  color: selectedYear === year ? '#FFFFFF' : '#666666',
                  background: selectedYear === year ? '#2e2e2e' : 'transparent',
                  border: 'none',
                  borderBottom: selectedYear === year ? '2px solid #FFFFFF' : '2px solid transparent',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  flexShrink: 0,
                  transition: 'color 0.1s',
                }}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Month nav */}
          <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #222222', overflowX: 'auto' }}>
            {MONTHS_SHORT.map((m, i) => (
              <button
                key={m}
                onClick={() => handleMonthChange(i)}
                style={{
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: selectedMonth === i ? 600 : 400,
                  color: selectedMonth === i ? '#C8102E' : '#666666',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: selectedMonth === i ? '2px solid #C8102E' : '2px solid transparent',
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  transition: 'color 0.1s',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-panel Archive Browser ─────────────────────── */}
      <div style={{ display: 'flex', maxWidth: '1280px', margin: '0 auto' }}>

        {/* Left: Event list */}
        <div style={{
          width: '240px',
          flexShrink: 0,
          background: '#141414',
          borderRight: '1px solid #222222',
          minHeight: 'calc(100vh - 360px)',
        }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #1f1f1f' }}>
            <p style={{ fontSize: '10px', color: '#444444', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              {MONTHS_FULL[selectedMonth]} {selectedYear}
            </p>
          </div>

          {monthEvents.length === 0 ? (
            <div style={{ padding: '20px 16px' }}>
              <p style={{ fontSize: '12px', color: '#444444' }}>No events this month.</p>
            </div>
          ) : (
            monthEvents.map(event => {
              const isActive = displayEvent?.id === event.id;
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '11px 16px',
                    background: isActive ? '#1f1f1f' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #1a1a1a',
                    borderLeft: isActive ? '3px solid #C8102E' : '3px solid transparent',
                    cursor: 'pointer',
                    paddingLeft: '13px',
                    display: 'block',
                  }}
                >
                  <p style={{ fontSize: '10px', color: '#C8102E', fontFamily: 'monospace', marginBottom: '3px', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {shortDate(event.date).toUpperCase()}
                  </p>
                  <p style={{ fontSize: '12px', color: isActive ? '#EEEEEE' : '#888888', lineHeight: 1.4, margin: 0 }}>
                    {event.title}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Event detail */}
        <div style={{ flex: 1, minWidth: 0, background: '#111111', padding: '36px 44px' }}>
          {displayEvent ? (
            <div>
              {/* Date + type */}
              <p style={{ fontSize: '11px', color: '#C8102E', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '18px', fontWeight: 600 }}>
                {longDate(displayEvent.date)}
                {displayEvent.event_type && (
                  <span style={{ marginLeft: '16px', color: '#444444', fontFamily: 'inherit' }}>
                    — {displayEvent.event_type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                )}
              </p>

              {/* Headline */}
              <h2 style={{ fontSize: '30px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.01em', maxWidth: '640px' }}>
                {displayEvent.title}
              </h2>

              {/* Description */}
              {displayEvent.description && (
                <p style={{ fontSize: '15px', color: '#BBBBBB', lineHeight: 1.75, marginBottom: '24px', maxWidth: '640px' }}>
                  {displayEvent.description}
                </p>
              )}

              {/* Location */}
              {displayEvent.location && (
                <p style={{ fontSize: '12px', color: '#555555', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#444444', border: '1px solid #2a2a2a', padding: '2px 6px', borderRadius: '2px' }}>
                    📍 {displayEvent.location}
                  </span>
                </p>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {displayEvent.event_type && (
                  <span style={{ fontSize: '11px', color: '#666666', border: '1px solid #2a2a2a', padding: '3px 10px', borderRadius: '2px' }}>
                    {displayEvent.event_type.replace(/_/g, ' ')}
                  </span>
                )}
                {displayEvent.members && displayEvent.members.map(m => (
                  <span key={m} style={{ fontSize: '11px', color: '#666666', border: '1px solid #2a2a2a', padding: '3px 10px', borderRadius: '2px' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ) : currentOverview ? (
            <div>
              <p style={{ fontSize: '11px', color: '#444444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                {MONTHS_FULL[selectedMonth]} {selectedYear} — Overview
              </p>
              <p style={{ fontSize: '15px', color: '#BBBBBB', lineHeight: 1.75 }}>{currentOverview.overview_text}</p>
            </div>
          ) : (
            <div style={{ paddingTop: '60px' }}>
              <p style={{ fontSize: '14px', color: '#333333' }}>Select an event from the list to read more.</p>
            </div>
          )}

          {/* ── On This Day ───────────────────────────────── */}
          {onThisDayEvents.length > 0 && (
            <div style={{ marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #1f1f1f' }}>
              <p style={{ fontSize: '11px', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
                On This Day — {today.getDate()} {MONTHS_SHORT[today.getMonth()]}
              </p>
              {onThisDayEvents.map(e => (
                <div
                  key={e.id}
                  style={{ display: 'flex', gap: '16px', paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid #1a1a1a' }}
                >
                  <span style={{ fontSize: '13px', color: '#C8102E', fontFamily: 'monospace', fontWeight: 600, flexShrink: 0, paddingTop: '1px' }}>
                    {new Date(e.date).getFullYear()}
                  </span>
                  <button
                    onClick={() => {
                      const yr = new Date(e.date).getFullYear();
                      const mo = new Date(e.date).getMonth();
                      setSelectedYear(yr);
                      setSelectedMonth(mo);
                      setSelectedEvent(e);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    <span style={{ fontSize: '14px', color: '#AAAAAA', lineHeight: 1.5 }}>{e.title}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
