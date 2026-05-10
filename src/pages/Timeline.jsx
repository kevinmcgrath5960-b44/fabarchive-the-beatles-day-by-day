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
          )}
        </div>

        {/* Type badge */}
        <div style={{ flexShrink: 0 }}>
          {event.event_type && <EventTypeBadge type={event.event_type} />}
        </div>
      </article>
    </Link>
  );
}

// ── Main Timeline page ────────────────────────────────────────────────────────
export default function Timeline() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialYear = parseInt(urlParams.get('year')) || 1963;
  const initialMonth = parseInt(urlParams.get('month')) || null;
  const initialMember = urlParams.get('member') || null;

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [eventType, setEventType] = useState(null);
  const [member, setMember] = useState(initialMember);

  const { setPhaseId } = usePhase();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('-date', 2000),
  });

  const phase = useMemo(() => getPhaseForYear(selectedYear), [selectedYear]);

  useEffect(() => {
    if (phase) setPhaseId(phase.id);
  }, [phase, setPhaseId]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      if (d.getFullYear() !== selectedYear) return false;
      if (selectedMonth && (d.getMonth() + 1) !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && !(e.members || []).includes(member)) return false;
      return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, selectedYear, selectedMonth, eventType, member]);

  // Group by month
  const byMonth = useMemo(() => {
    const map = {};
    filtered.forEach(e => {
      const m = new Date(e.date).getMonth() + 1;
      if (!map[m]) map[m] = [];
      map[m].push(e);
    });
    return map;
  }, [filtered]);

  const monthKeys = Object.keys(byMonth).map(Number).sort((a, b) => a - b);

  if (!phase) return null;

  return (
    <div className={`phase-${phase.id}`} style={{ background: 'var(--phase-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={(y) => { setSelectedYear(y); setSelectedMonth(null); }}
          onMonthChange={setSelectedMonth}
          phase={phase}
          eventCounts={events.reduce((acc, e) => {
            if (!e.date) return acc;
            const y = new Date(e.date).getFullYear();
            acc[y] = (acc[y] || 0) + 1;
            return acc;
          }, {})}
        />

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 32px 64px', paddingLeft: '48px' }}>
          {/* Year header */}
          <div style={{ marginBottom: '28px', paddingLeft: '14px' }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--phase-muted)',
              fontFamily: phase.fonts.mono,
              marginBottom: '4px',
            }}>
              {phase.label}
            </p>
            <h1 style={{
              fontSize: '36px',
              fontWeight: phase.weights.heading,
              fontFamily: phase.fonts.heading,
              color: 'var(--phase-ink)',
              lineHeight: 1.1,
              marginBottom: '4px',
            }}>
              {selectedYear}
              {YEAR_IN_WORDS && YEAR_IN_WORDS[selectedYear] && (
                <span style={{ fontSize: '16px', fontWeight: 400, marginLeft: '14px', color: 'var(--phase-muted)', fontStyle: 'italic' }}>
                  {YEAR_IN_WORDS[selectedYear]}
                </span>
              )}
            </h1>
            {YEAR_SUBTITLES && YEAR_SUBTITLES[selectedYear] && (
              <p style={{ fontSize: '13px', color: 'var(--phase-muted)', fontFamily: phase.fonts.body, marginTop: '2px' }}>
                {YEAR_SUBTITLES[selectedYear]}
              </p>
            )}
          </div>

          {/* Filter bar */}
          <div style={{ paddingLeft: '14px' }}>
            <FilterBar
              eventType={eventType}
              member={member}
              onEventTypeChange={setEventType}
              onMemberChange={setMember}
            />
          </div>

          {/* Results count */}
          <div style={{ paddingLeft: '14px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--phase-muted)', fontFamily: phase.fonts.mono }}>
              {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
              {selectedMonth ? ` · ${MONTH_NAMES[selectedMonth]}` : ''}
            </span>
          </div>

          {isLoading && (
            <div style={{ paddingLeft: '14px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: '44px', background: 'var(--phase-surface)', marginBottom: '2px', opacity: 0.5 }} />
              ))}
            </div>
          )}

          {/* Events grouped by month */}
          {monthKeys.map((m, idx) => (
            <div key={m}>
              {idx > 0 && <PhaseDecoration decoration={phase.decoration} mmtPalette={phase.mmtPalette} />}
              <div style={{ paddingLeft: '14px', marginBottom: '8px', marginTop: idx === 0 ? 0 : '8px' }}>
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--phase-accent)',
                  fontFamily: phase.fonts.mono,
                }}>
                  {MONTH_NAMES[m]}
                </h2>
              </div>
              <div>
                {byMonth[m].map(event => (
                  <EventRow key={event.id} event={event} phase={phase} />
                ))}
              </div>
            </div>
          ))}

          {!isLoading && filtered.length === 0 && (
            <div style={{ paddingLeft: '14px', paddingTop: '40px' }}>
              <p style={{ fontSize: '14px', color: 'var(--phase-muted)' }}>No events found for this selection.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}