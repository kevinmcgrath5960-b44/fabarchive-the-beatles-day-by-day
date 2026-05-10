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
  const params = new URLSearchParams(window.location.search);
  const initYear = params.get('year') ? Number(params.get('year')) : 1962;
  const initMember = params.get('member') || null;

  const [selectedYear, setSelectedYear] = useState(initYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [eventType, setEventType] = useState(null);
  const [member, setMember] = useState(initMember);

  const { setPhaseId } = usePhase();
  const phase = getPhaseForYear(selectedYear);

  // Sync navbar phase whenever the year changes
  useEffect(() => {
    setPhaseId(phase.id);
    return () => setPhaseId(null);
  }, [phase.id, setPhaseId]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      if (d.getFullYear() !== selectedYear) return false;
      if (selectedMonth && d.getMonth() + 1 !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && (!e.members || !e.members.includes(member))) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [events, selectedYear, selectedMonth, eventType, member]);

  // Stats for the year
  const yearEvents = useMemo(() =>
    events.filter(e => e.date && new Date(e.date).getFullYear() === selectedYear),
    [events, selectedYear]
  );
  const monthsActive = useMemo(() => {
    const s = new Set(yearEvents.map(e => new Date(e.date).getMonth()));
    return s.size;
  }, [yearEvents]);

  // Headline font size — cap so it fits the content column
  const headlineSizePx = Math.min(phase.headlineSizePx, 68);

  return (
    <div
      className={`phase-${phase.id}`}
      style={{ minHeight: '100vh', background: 'var(--phase-bg)', transition: 'background 0.5s ease' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={y => { setSelectedYear(y); setSelectedMonth(null); }}
          onMonthChange={setSelectedMonth}
        />

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, padding: '0 48px 72px', maxWidth: 'calc(100% - 210px)' }}>

          {/* Phase ribbon */}
          <div style={{
            padding: '15px 0 13px',
            borderBottom: '1px solid var(--phase-muted)',
            marginBottom: '36px',
          }}>
            <span style={{
              fontSize: '9px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--phase-accent)',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              opacity: 0.9,
            }}>
              {phase.label}&ensp;·&ensp;{phase.sublabel}&ensp;·&ensp;{phase.years}
            </span>
          </div>

          {/* Year headline */}
          <h1 style={{
            fontFamily: phase.fonts.display,
            fontSize: `${headlineSizePx}px`,
            fontWeight: phase.weights.display,
            color: 'var(--phase-ink)',
            lineHeight: phase.headlineLineHeight,
            letterSpacing: phase.headlineTracking,
            textTransform: phase.headlineCase,
            marginBottom: '14px',
          }}>
            {YEAR_IN_WORDS[selectedYear]}
          </h1>

          {/* Year subtitle */}
          <p style={{
            fontSize: '14px',
            color: 'var(--phase-muted)',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '20px',
          }}>
            {YEAR_SUBTITLES[selectedYear]}
          </p>

          {/* Stat strip */}
          {!isLoading && (
            <div style={{ display: 'flex', gap: '28px', marginBottom: '4px' }}>
              {[
                { value: yearEvents.length, label: 'events' },
                { value: monthsActive,      label: 'months' },
              ].map(({ value, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    fontFamily: phase.fonts.display,
                    color: 'var(--phase-ink)',
                    lineHeight: 1,
                  }}>{value}</span>
                  <span style={{
                    fontSize: '9px',
                    color: 'var(--phase-muted)',
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                  }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Phase decoration */}
          <PhaseDecoration decoration={phase.decoration} mmtPalette={phase.mmtPalette} />

          {/* Month heading (when a month is selected) */}
          {selectedMonth && (
            <h2 style={{
              fontFamily: phase.fonts.body,
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--phase-ink)',
              marginBottom: '16px',
              letterSpacing: '0.01em',
            }}>
              {MONTH_NAMES[selectedMonth]}
            </h2>
          )}

          {/* FilterBar — sits inside .phase-{id} so CSS vars apply */}
          <FilterBar
            eventType={eventType}
            member={member}
            onEventTypeChange={setEventType}
            onMemberChange={setMember}
          />

          {/* Event list */}
          {isLoading ? (
            <div style={{ marginTop: '8px' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  height: '52px', background: 'var(--phase-surface)',
                  marginBottom: '2px', opacity: 0.4,
                }} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p style={{
                fontSize: '13px', color: 'var(--phase-muted)',
                fontFamily: '"Inter", sans-serif',
              }}>
                No events found for this period.
              </p>
            </div>
          ) : (
            <div style={{ marginLeft: '14px' }}>
              {filteredEvents.map(event => (
                <EventRow key={event.id} event={event} phase={phase} />
              ))}
              <p style={{
                fontSize: '10px',
                color: 'var(--phase-muted)',
                marginTop: '28px',
                textAlign: 'center',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: '"Inter", sans-serif',
                opacity: 0.6,
              }}>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
