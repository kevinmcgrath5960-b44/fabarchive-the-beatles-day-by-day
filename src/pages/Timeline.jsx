import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import TimelineSidebar from '../components/timeline/TimelineSidebar';
import FilterBar from '../components/timeline/FilterBar';
<<<<<<< Updated upstream
import EventTypeBadge from '../components/shared/EventTypeBadge';
=======
>>>>>>> Stashed changes
import { getPhaseForYear, YEAR_IN_WORDS, YEAR_SUBTITLES } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

<<<<<<< Updated upstream
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
=======
// ── Phase decoration (between month groups) ───────────────────────────────────
function PhaseDecoration({ decoration, mmtPalette }) {
  if (decoration === 'asterisks') {
    return (
      <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--phase-accent)', fontSize: '13px', letterSpacing: '14px' }}>
>>>>>>> Stashed changes
        ✦ ✦ ✦ ✦ ✦
      </div>
    );
  }
  if (decoration === 'rainbow') {
    const palette = mmtPalette || ['#FCC419', '#E37817', '#46BDE0', '#8FBFDB', '#ED1C24'];
    return (
<<<<<<< Updated upstream
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
=======
      <div style={{ display: 'flex', height: '4px', margin: '20px 0' }}>
        {palette.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
      </div>
    );
  }
  return <div style={{ height: '1px', background: 'var(--phase-accent)', margin: '20px 0', opacity: 0.35 }} />;
}

// ── Event row — matches mockup: big day | title+excerpt | type+location right ─
function EventRow({ event, phase }) {
  const [hovered, setHovered] = useState(false);
  const d = event.date ? new Date(event.date) : null;
  const day   = d ? format(d, 'd')   : '?';
  const mon   = d ? format(d, 'MMM').toUpperCase() : '';

  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description : null;
>>>>>>> Stashed changes

  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
<<<<<<< Updated upstream
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
=======
          gridTemplateColumns: '52px 1fr 160px',
          gap: '20px',
          alignItems: 'flex-start',
          padding: '14px 0',
          borderTop: '1px solid var(--phase-surface)',
        }}
      >
        {/* Day + Month */}
        <div style={{ textAlign: 'center', paddingTop: '1px' }}>
          {dateStr ? (
            <div style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '10px',
              color: 'var(--phase-muted)',
              lineHeight: 1.4,
            }}>{dateStr}</div>
          ) : (
            <>
              <div style={{
                fontFamily: phase.fonts.display,
                fontSize: '28px',
                fontWeight: 700,
                color: hovered ? 'var(--phase-accent)' : 'var(--phase-ink)',
                lineHeight: 1,
                transition: 'color 0.15s',
              }}>{day}</div>
              <div style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '8px',
                color: 'var(--phase-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>{mon}</div>
            </>
          )}
>>>>>>> Stashed changes
        </div>

        {/* Title + excerpt */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: '14px',
<<<<<<< Updated upstream
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
=======
            fontFamily: phase.fonts.body,
            fontWeight: 500,
            color: hovered ? 'var(--phase-accent)' : 'var(--phase-ink)',
            lineHeight: 1.35,
            marginBottom: event.body ? '4px' : 0,
            transition: 'color 0.15s',
          }}>{event.title}</h3>
          {event.body && (
            <p style={{
              fontSize: '12px',
              fontFamily: '"Inter", sans-serif',
              color: 'var(--phase-muted)',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>{event.body.substring(0, 220)}</p>
          )}
        </div>

        {/* Type + location — right-aligned */}
        <div style={{ textAlign: 'right', paddingTop: '2px' }}>
          {event.event_type && (
            <div style={{
              fontSize: '9px',
              fontFamily: '"Inter", sans-serif',
              color: 'var(--phase-accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '4px',
            }}>{event.event_type}</div>
          )}
          {event.location && (
            <div style={{
              fontSize: '11px',
              fontFamily: phase.fonts.body,
              fontStyle: 'italic',
              color: 'var(--phase-muted)',
              lineHeight: 1.3,
            }}>{event.location}</div>
          )}
>>>>>>> Stashed changes
        </div>
      </article>
    </Link>
  );
}

<<<<<<< Updated upstream
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
=======
// ── Lead entry — featured event at top of year view ───────────────────────────
function LeadEntry({ event, phase }) {
  if (!event) return null;
  const d = event.date ? new Date(event.date) : null;
  const dateLabel = d ? format(d, 'd MMMM').toUpperCase() : '';
  const hasPhoto = event.photos?.length > 0;

  return (
    <div style={{ marginBottom: '48px' }}>
      <p style={{
        fontSize: '9px',
        fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--phase-muted)',
        marginBottom: '14px',
        fontWeight: 500,
      }}>
        ★ Lead Entry · {dateLabel}
      </p>

      <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: hasPhoto ? '1fr 1fr' : '1fr',
          border: '1px solid var(--phase-surface)',
        }}>
          {hasPhoto && (
            <div>
              <img
                src={event.photos[0].url}
                alt={event.title}
                style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
              />
              {event.photos[0].caption && (
                <p style={{
                  fontSize: '9px',
                  fontFamily: '"Inter", sans-serif',
                  color: 'var(--phase-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '8px 12px',
                  background: 'var(--phase-surface)',
                }}>Photographed · {event.photos[0].caption}</p>
              )}
            </div>
          )}
          <div style={{ padding: hasPhoto ? '28px 28px 28px 28px' : '28px' }}>
            <h2 style={{
              fontFamily: phase.fonts.display,
              fontSize: '26px',
              fontWeight: phase.weights.display,
              color: 'var(--phase-ink)',
              lineHeight: 1.2,
              marginBottom: '14px',
            }}>{event.title}</h2>
            {event.body && (
              <p style={{
                fontSize: '13px',
                fontFamily: '"Inter", sans-serif',
                color: 'var(--phase-muted)',
                lineHeight: 1.7,
                marginBottom: '22px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}>{event.body.substring(0, 320)}</p>
            )}
            <div style={{
              display: 'inline-block',
              padding: '9px 18px',
              background: 'var(--phase-ink)',
              color: 'var(--phase-bg)',
              fontSize: '10px',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              Read Entry →
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Phase ribbon ──────────────────────────────────────────────────────────────
function PhaseRibbon({ phase, yearEvents, filteredEvents, selectedMonth }) {
  const isYearView = !selectedMonth;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0 12px',
      borderBottom: '1px solid var(--phase-surface)',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          background: 'var(--phase-accent)',
          color: 'var(--phase-bg)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          padding: '4px 10px',
          whiteSpace: 'nowrap',
        }}>
          Phase · {phase.label} · {phase.sublabel}
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--phase-muted)',
          fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.05em',
        }}>
          {phase.years}
        </span>
      </div>
      <span style={{
        fontSize: '10px',
        color: 'var(--phase-muted)',
        fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {isYearView
          ? `${yearEvents.length} entries · Whole Year`
          : `${filteredEvents.length} entries · ${MONTH_NAMES[selectedMonth]}`}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Timeline() {
  const params = new URLSearchParams(window.location.search);
  const initYear   = params.get('year')   ? Number(params.get('year')) : 1962;
  const initMember = params.get('member') || null;

  const [selectedYear,  setSelectedYear]  = useState(initYear);
  const [selectedMonth, setSelectedMonth] = useState(null);  // null = year overview
  const [eventType,     setEventType]     = useState(null);
  const [member,        setMember]        = useState(initMember);

  const { setPhaseId } = usePhase();
  const phase = getPhaseForYear(selectedYear);

  useEffect(() => {
    setPhaseId(phase.id);
    return () => setPhaseId(null);
  }, [phase.id, setPhaseId]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  // All events for the selected year, sorted chronologically
  const yearEvents = useMemo(() =>
    events
      .filter(e => e.date && new Date(e.date).getFullYear() === selectedYear)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [events, selectedYear]
  );

  // Filtered events for month view
  const filteredEvents = useMemo(() => {
    if (!selectedMonth) return yearEvents;
    return yearEvents.filter(e => {
      if (new Date(e.date).getMonth() + 1 !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && (!e.members || !e.members.includes(member))) return false;
      return true;
    });
  }, [yearEvents, selectedMonth, eventType, member]);

  // Stat strip counts
  const typeStats = useMemo(() => [
    { label: 'Recording Sessions', count: yearEvents.filter(e => e.event_type === 'Recording Session').length },
    { label: 'Live Shows',         count: yearEvents.filter(e => e.event_type === 'Live Performance').length },
    { label: 'Releases',           count: yearEvents.filter(e => e.event_type === 'Release').length },
    { label: 'Media / TV',         count: yearEvents.filter(e => e.event_type === 'Media Appearance').length },
  ], [yearEvents]);

  // Lead entry = first event with a photo, else first event
  const leadEvent = useMemo(() =>
    yearEvents.find(e => e.photos?.length > 0) || yearEvents[0],
    [yearEvents]
  );

  // Group year events by month
  const eventsByMonth = useMemo(() => {
    const map = new Map();
    yearEvents.forEach(e => {
      const m = new Date(e.date).getMonth() + 1;
      if (!map.has(m)) map.set(m, []);
      map.get(m).push(e);
    });
    return map;
  }, [yearEvents]);

  const isYearView = !selectedMonth;
  const headlineSizePx = Math.min(phase.headlineSizePx, 68);

  const handleYearChange = y => {
    setSelectedYear(y);
    setSelectedMonth(null);
    setEventType(null);
    setMember(null);
  };

  return (
    <div
      className={`phase-${phase.id}`}
      style={{ minHeight: '100vh', background: 'var(--phase-bg)', transition: 'background 0.5s ease' }}
    >
      <div className="max-w-7xl mx-auto w-full" style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onMonthChange={m => { setSelectedMonth(m); setEventType(null); setMember(null); }}
          member={member}
          onMemberChange={setMember}
        />

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, padding: '0 48px 72px' }}>

          {!isLoading && (
            <PhaseRibbon
              phase={phase}
              yearEvents={yearEvents}
              filteredEvents={filteredEvents}
              selectedMonth={selectedMonth}
            />
          )}

          {/* ════════════════ YEAR OVERVIEW VIEW ════════════════════════ */}
          {isYearView && (
            <>
              {/* Year headline */}
              <h1 style={{
                fontFamily: phase.fonts.display,
                fontSize: `${headlineSizePx}px`,
                fontWeight: phase.weights.display,
                color: 'var(--phase-ink)',
                lineHeight: phase.headlineLineHeight,
                letterSpacing: phase.headlineTracking,
                textTransform: phase.headlineCase,
                marginBottom: '10px',
              }}>
                {YEAR_IN_WORDS[selectedYear]}
              </h1>

              <p style={{
                fontSize: '15px',
                fontStyle: 'italic',
                color: 'var(--phase-muted)',
                fontFamily: phase.fonts.body,
                lineHeight: 1.5,
                marginBottom: '32px',
              }}>
                {YEAR_SUBTITLES[selectedYear]}
              </p>

              {/* Stat strip */}
              {!isLoading && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  marginBottom: '40px',
                }}>
                  {typeStats.map(({ label, count }, i) => (
                    <div key={label} style={{
                      padding: '20px 16px',
                      textAlign: 'center',
                      border: '1px solid var(--phase-surface)',
                      borderLeft: i > 0 ? 'none' : '1px solid var(--phase-surface)',
                    }}>
                      <div style={{
                        fontFamily: phase.fonts.display,
                        fontSize: '44px',
                        fontWeight: 700,
                        color: 'var(--phase-ink)',
                        lineHeight: 1,
                        marginBottom: '8px',
                      }}>{count}</div>
                      <div style={{
                        fontSize: '9px',
                        fontFamily: '"Inter", sans-serif',
                        color: 'var(--phase-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 500,
                      }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lead entry */}
              {!isLoading && leadEvent && (
                <LeadEntry event={leadEvent} phase={phase} />
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ height: '60px', background: 'var(--phase-surface)', marginBottom: '2px', opacity: 0.4 }} />
                  ))}
                </div>
              )}

              {/* The Year in Days — grouped by month */}
              {!isLoading && yearEvents.length > 0 && (
                <div>
                  <p style={{
                    fontSize: '9px',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--phase-muted)',
                    marginBottom: '24px',
                    fontWeight: 500,
                  }}>The Year in Days</p>

                  {Array.from(eventsByMonth.entries()).map(([month, monthEvents], idx, arr) => (
                    <div key={month}>
                      {/* Month chapter header */}
                      <h2 style={{
                        fontSize: '10px',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--phase-accent)',
                        marginBottom: '0',
                        paddingBottom: '8px',
                        borderBottom: '2px solid var(--phase-accent)',
                      }}>
                        {MONTH_NAMES[month]}
                      </h2>

                      {monthEvents.map(event => (
                        <EventRow key={event.id} event={event} phase={phase} />
                      ))}

                      {/* Decoration between months (not after last) */}
                      {idx < arr.length - 1 && (
                        <PhaseDecoration
                          decoration={phase.decoration}
                          mmtPalette={phase.mmtPalette}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && yearEvents.length === 0 && (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--phase-muted)', fontFamily: '"Inter", sans-serif' }}>
                    No events found for {selectedYear}.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ════════════════ MONTH VIEW ═════════════════════════════════ */}
          {!isYearView && (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{
                  fontFamily: phase.fonts.display,
                  fontSize: '44px',
                  fontWeight: phase.weights.display,
                  color: 'var(--phase-ink)',
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}>
                  <span style={{ opacity: 0.45, fontWeight: 400 }}>{selectedYear} · </span>
                  {MONTH_NAMES[selectedMonth]}
                </h1>
              </div>

              <FilterBar
                eventType={eventType}
                member={member}
                onEventTypeChange={setEventType}
                onMemberChange={setMember}
              />

              {isLoading ? (
                <div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ height: '60px', background: 'var(--phase-surface)', marginBottom: '2px', opacity: 0.4 }} />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--phase-muted)', fontFamily: '"Inter", sans-serif' }}>
                    No events found for {MONTH_NAMES[selectedMonth]} {selectedYear}.
                  </p>
                </div>
              ) : (
                <div>
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
            </>
          )}

>>>>>>> Stashed changes
        </main>
      </div>
    </div>
  );
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
