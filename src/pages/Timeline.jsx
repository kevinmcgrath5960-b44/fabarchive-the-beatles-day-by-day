import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import TimelineSidebar from '../components/timeline/TimelineSidebar';
import FilterBar from '../components/timeline/FilterBar';
import { getPhaseForYear, YEAR_IN_WORDS, YEAR_SUBTITLES } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// ── Phase decoration (between month groups) ───────────────────────────────────
function PhaseDecoration({ decoration, mmtPalette }) {
  if (decoration === 'asterisks') {
    return (
      <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--phase-accent)', fontSize: '13px', letterSpacing: '14px' }}>
        ✦ ✦ ✦ ✦ ✦
      </div>
    );
  }
  if (decoration === 'rainbow') {
    const palette = mmtPalette || ['#FCC419', '#E37817', '#46BDE0', '#8FBFDB', '#ED1C24'];
    return (
      <div style={{ display: 'flex', height: '4px', margin: '20px 0' }}>
        {palette.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
      </div>
    );
  }
  return <div style={{ height: '1px', background: 'var(--phase-accent)', margin: '20px 0', opacity: 0.35 }} />;
}

// ── Event row — big day | title+excerpt | type+location right-aligned ─────────
function EventRow({ event, phase }) {
  const [hovered, setHovered] = useState(false);
  const d = event.date ? new Date(event.date) : null;
  const day = d ? format(d, 'd') : '?';
  const mon = d ? format(d, 'MMM').toUpperCase() : '';
  const approxStr = event.approximate_date && event.approximate_description
    ? event.approximate_description : null;

  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '52px 1fr 160px',
          gap: '20px',
          alignItems: 'flex-start',
          padding: '14px 0',
          borderTop: '1px solid var(--phase-surface)',
        }}
      >
        {/* Day + Month */}
        <div style={{ textAlign: 'center', paddingTop: '1px' }}>
          {approxStr ? (
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', color: 'var(--phase-muted)', lineHeight: 1.4 }}>
              {approxStr}
            </div>
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
        </div>

        {/* Title + excerpt */}
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: '14px',
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
        </div>
      </article>
    </Link>
  );
}

// ── Lead entry — featured event card ─────────────────────────────────────────
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
          <div style={{ padding: '28px' }}>
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
            }}>Read Entry →</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Image placeholder ─────────────────────────────────────────────────────────
function ImagePlaceholder({ aspect = '16/9', label = 'Photograph' }) {
  return (
    <div style={{
      width: '100%',
      aspectRatio: aspect,
      background: 'var(--phase-surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid var(--phase-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px',
        opacity: 0.4,
      }}>
        <span style={{ fontSize: '14px', color: 'var(--phase-muted)' }}>◎</span>
      </div>
      <span style={{
        fontSize: '9px', fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--phase-muted)', opacity: 0.5,
      }}>{label}</span>
    </div>
  );
}

// ── Year blog — full narrative view replacing the day list ────────────────────
function YearBlog({ yearOverview, phase, year }) {
  if (!yearOverview) return null;

  const themes = yearOverview.key_themes
    ? yearOverview.key_themes.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div>
      {/* Section label */}
      <p style={{
        fontSize: '9px', fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--phase-muted)', marginBottom: '20px', fontWeight: 500,
      }}>The Year in Full</p>

      {/* Hero image placeholder */}
      <div style={{ marginBottom: '32px', border: '1px solid var(--phase-surface)' }}>
        <ImagePlaceholder aspect="21/9" label="Year in photographs" />
      </div>

      {/* Narrative prose */}
      <div style={{
        fontSize: '15px',
        lineHeight: 1.9,
        color: 'var(--phase-ink)',
        fontFamily: phase.fonts.body,
        fontWeight: phase.weights.body,
        maxWidth: '680px',
        marginBottom: '36px',
      }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p style={{ marginBottom: '1.4em' }}>{children}</p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: 'var(--phase-ink)', fontWeight: 600 }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ fontStyle: 'italic', color: 'var(--phase-ink)' }}>{children}</em>
            ),
            // Suppress any headings that snuck into the text
            h1: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
            h2: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
            h3: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
          }}
        >
          {yearOverview.overview_text}
        </ReactMarkdown>
      </div>

      {/* Inline image placeholders — break up the text */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px',
        marginBottom: '36px', border: '1px solid var(--phase-surface)',
      }}>
        <ImagePlaceholder aspect="4/3" label="Studio" />
        <ImagePlaceholder aspect="4/3" label="Live" />
      </div>

      {/* Key themes chips */}
      {themes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <span style={{
            fontSize: '9px', fontFamily: '"Inter", sans-serif',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--phase-muted)', alignSelf: 'center', marginRight: '4px',
          }}>Themes:</span>
          {themes.map(t => (
            <span key={t} style={{
              fontSize: '10px', fontFamily: '"Inter", sans-serif',
              color: 'var(--phase-accent)', border: '1px solid var(--phase-accent)',
              padding: '3px 10px', letterSpacing: '0.06em',
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Divider before day listing prompt */}
      <div style={{
        marginTop: '40px', paddingTop: '20px',
        borderTop: '1px solid var(--phase-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{
          fontSize: '10px', fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--phase-muted)', opacity: 0.6, textAlign: 'center',
        }}>
          Select a month from the sidebar to view events day by day
        </p>
      </div>
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
        }}>{phase.years}</span>
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
  const [selectedMonth, setSelectedMonth] = useState(null);
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

  const { data: yearOverviews = [] } = useQuery({
    queryKey: ['year-overviews'],
    queryFn: () => base44.entities.YearOverview.list(),
  });

  const yearOverview = useMemo(() =>
    yearOverviews.find(o => o.year === selectedYear),
    [yearOverviews, selectedYear]
  );

  const yearEvents = useMemo(() =>
    events
      .filter(e => e.date && new Date(e.date).getFullYear() === selectedYear)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [events, selectedYear]
  );

  const filteredEvents = useMemo(() => {
    if (!selectedMonth) return yearEvents;
    return yearEvents.filter(e => {
      if (new Date(e.date).getMonth() + 1 !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && (!e.members || !e.members.includes(member))) return false;
      return true;
    });
  }, [yearEvents, selectedMonth, eventType, member]);

  const typeStats = useMemo(() => [
    { label: 'Recording Sessions', count: yearEvents.filter(e => e.event_type === 'Recording Session').length },
    { label: 'Live Shows',         count: yearEvents.filter(e => e.event_type === 'Live Performance').length },
    { label: 'Releases',           count: yearEvents.filter(e => e.event_type === 'Release').length },
    { label: 'Media / TV',         count: yearEvents.filter(e => e.event_type === 'Media Appearance').length },
  ], [yearEvents]);

  const leadEvent = useMemo(() =>
    yearEvents.find(e => e.photos?.length > 0) || yearEvents[0],
    [yearEvents]
  );

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

  return (
    <div
      className={`phase-${phase.id}`}
      style={{ minHeight: '100vh', background: 'var(--phase-bg)', transition: 'background 0.5s ease' }}
    >
      <div className="max-w-7xl mx-auto w-full" style={{ display: 'flex', alignItems: 'flex-start' }}>

        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={y => { setSelectedYear(y); setSelectedMonth(null); setEventType(null); setMember(null); }}
          onMonthChange={m => { setSelectedMonth(m); setEventType(null); setMember(null); }}
          member={member}
          onMemberChange={setMember}
        />

        <main style={{ flex: 1, minWidth: 0, padding: '0 48px 72px' }}>

          {!isLoading && (
            <PhaseRibbon
              phase={phase}
              yearEvents={yearEvents}
              filteredEvents={filteredEvents}
              selectedMonth={selectedMonth}
            />
          )}

          {/* ═══ YEAR OVERVIEW ═══════════════════════════════════════════ */}
          {isYearView && (
            <>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '40px' }}>
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
              {!isLoading && leadEvent && <LeadEntry event={leadEvent} phase={phase} />}

              {isLoading && (
                <div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ height: '40px', background: 'var(--phase-surface)', marginBottom: '8px', opacity: 0.3 }} />
                  ))}
                </div>
              )}

              {/* Year blog — replaces the day-by-day list in year view */}
              {!isLoading && (
                <YearBlog
                  yearOverview={yearOverview}
                  phase={phase}
                  year={selectedYear}
                />
              )}
            </>
          )}

          {/* ═══ MONTH VIEW ══════════════════════════════════════════════ */}
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

        </main>
      </div>
    </div>
  );
}
