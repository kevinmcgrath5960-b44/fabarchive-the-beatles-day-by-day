import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import TimelineSidebar from '../components/timeline/TimelineSidebar';
import FilterBar from '../components/timeline/FilterBar';
import { getPhaseForYear, YEAR_IN_WORDS, YEAR_CHAPTER_TITLES, YEAR_SUBTITLES } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Stat card definitions
const STAT_TYPE_MAP = [
  { label: 'Recording Sessions', type: 'Recording Session' },
  { label: 'Live Shows',         type: 'Live Performance' },
  { label: 'Releases',           type: 'Release' },
  { label: 'Media / TV',         type: 'Media Appearance' },
];

// ── Phase decoration ──────────────────────────────────────────────────────────
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

// ── Event row ─────────────────────────────────────────────────────────────────
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

// ── Year highlights — random selection of up to 5 notable events ──────────────
function YearHighlights({ highlights, phase }) {
  if (!highlights.length) return null;

  return (
    <div style={{ marginBottom: '52px' }}>
      <p style={{
        fontSize: '9px', fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--phase-muted)', marginBottom: '4px', fontWeight: 500,
      }}>
        Year Highlights
      </p>
      <p style={{
        fontSize: '10px', fontFamily: '"Inter", sans-serif',
        color: 'var(--phase-muted)', marginBottom: '20px', opacity: 0.55,
        letterSpacing: '0.04em',
      }}>
        A selection of notable moments — refreshes each visit
      </p>

      {highlights.map((event, i) => {
        const d = event.date ? new Date(event.date) : null;
        const dateLabel = d ? format(d, 'd MMMM').toUpperCase() : '';
        const hasPhoto = event.photos?.length > 0;

        return (
          <Link key={event.id} to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: hasPhoto ? '120px 1fr' : '36px 1fr',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '18px 0',
                borderTop: i === 0 ? '2px solid var(--phase-accent)' : '1px solid var(--phase-surface)',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {/* Photo thumbnail or index number */}
              {hasPhoto ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={event.photos[0].url}
                    alt={event.title}
                    style={{ width: '120px', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', top: '6px', left: '6px',
                    background: 'var(--phase-accent)', color: 'var(--phase-bg)',
                    fontFamily: '"Inter", sans-serif', fontSize: '9px',
                    fontWeight: 700, padding: '2px 6px', letterSpacing: '0.06em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ) : (
                <div style={{
                  fontFamily: phase.fonts.display,
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'var(--phase-muted)',
                  opacity: 0.3,
                  lineHeight: 1,
                  paddingTop: '2px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              )}

              {/* Content */}
              <div>
                <div style={{
                  fontSize: '9px',
                  fontFamily: '"Inter", sans-serif',
                  color: 'var(--phase-accent)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '5px',
                }}>
                  {dateLabel}
                  {event.event_type && <span style={{ color: 'var(--phase-muted)', fontWeight: 400, marginLeft: '8px' }}>· {event.event_type}</span>}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontFamily: phase.fonts.body,
                  fontWeight: 500,
                  color: 'var(--phase-ink)',
                  lineHeight: 1.3,
                  marginBottom: event.body ? '6px' : 0,
                }}>{event.title}</h3>
                {event.body && (
                  <p style={{
                    fontSize: '12px',
                    fontFamily: '"Inter", sans-serif',
                    color: 'var(--phase-muted)',
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>{event.body.substring(0, 180)}</p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
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
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid var(--phase-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px', opacity: 0.4,
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

// ── Year blog narrative ───────────────────────────────────────────────────────
function YearBlog({ yearOverview, phase }) {
  if (!yearOverview) return null;

  const themes = yearOverview.key_themes
    ? yearOverview.key_themes.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div>
      <p style={{
        fontSize: '9px', fontFamily: '"Inter", sans-serif',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--phase-muted)', marginBottom: '20px', fontWeight: 500,
      }}>The Year in Full</p>

      <div style={{ marginBottom: '32px', border: '1px solid var(--phase-surface)' }}>
        <ImagePlaceholder aspect="21/9" label="Year in photographs" />
      </div>

      <div style={{
        fontSize: '15px', lineHeight: 1.9,
        color: 'var(--phase-ink)',
        fontFamily: phase.fonts.body,
        fontWeight: phase.weights.body,
        maxWidth: '680px', marginBottom: '36px',
      }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={{ marginBottom: '1.4em' }}>{children}</p>,
            strong: ({ children }) => <strong style={{ color: 'var(--phase-ink)', fontWeight: 600 }}>{children}</strong>,
            em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'var(--phase-ink)' }}>{children}</em>,
            h1: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
            h2: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
            h3: ({ children }) => <p style={{ fontWeight: 600, marginBottom: '1em' }}>{children}</p>,
          }}
        >
          {yearOverview.overview_text}
        </ReactMarkdown>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px',
        marginBottom: '36px', border: '1px solid var(--phase-surface)',
      }}>
        <ImagePlaceholder aspect="4/3" label="Studio" />
        <ImagePlaceholder aspect="4/3" label="Live" />
      </div>

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

// ── Stat-filtered event list ──────────────────────────────────────────────────
function StatFilteredList({ events, phase, label, onClear }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <p style={{
          fontSize: '9px', fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--phase-accent)', fontWeight: 600,
        }}>
          {label} · {events.length} event{events.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onClear}
          style={{
            fontSize: '10px', fontFamily: '"Inter", sans-serif',
            color: 'var(--phase-muted)', background: 'none',
            border: '1px solid var(--phase-muted)',
            padding: '3px 10px', cursor: 'pointer',
            letterSpacing: '0.06em', transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--phase-ink)'; e.currentTarget.style.borderColor = 'var(--phase-ink)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--phase-muted)'; e.currentTarget.style.borderColor = 'var(--phase-muted)'; }}
        >
          × Clear filter
        </button>
      </div>
      {events.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--phase-muted)', fontFamily: '"Inter", sans-serif', padding: '40px 0', textAlign: 'center' }}>
          No {label.toLowerCase()} this year.
        </p>
      ) : (
        <div>
          {events.map(event => (
            <EventRow key={event.id} event={event} phase={phase} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Phase ribbon ──────────────────────────────────────────────────────────────
function PhaseRibbon({ phase, yearEvents, filteredEvents, selectedMonth }) {
  const isYearView = !selectedMonth;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0 12px',
      borderBottom: '1px solid var(--phase-surface)',
      marginBottom: '32px', flexWrap: 'wrap', gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          background: 'var(--phase-accent)', color: 'var(--phase-bg)',
          fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
          fontFamily: '"Inter", sans-serif', fontWeight: 700,
          padding: '4px 10px', whiteSpace: 'nowrap',
        }}>
          Phase · {phase.label} · {phase.sublabel}
        </span>
        <span style={{
          fontSize: '11px', color: 'var(--phase-muted)',
          fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em',
        }}>{phase.years}</span>
      </div>
      <span style={{
        fontSize: '10px', color: 'var(--phase-muted)',
        fontFamily: '"Inter", sans-serif', letterSpacing: '0.1em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {isYearView
          ? `${yearEvents.length} entries · Whole Year`
          : `${filteredEvents.length} entries · ${MONTH_NAMES[selectedMonth]}`}
      </span>
    </div>
  );
}

// ── Stat strip — interactive cards ───────────────────────────────────────────
function StatStrip({ stats, activeType, onStatClick }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '40px' }}>
      {stats.map(({ label, type, count }, i) => {
        const isActive = activeType === type;
        return (
          <button
            key={label}
            onClick={() => onStatClick(type)}
            style={{
              padding: '20px 16px', textAlign: 'center',
              border: '1px solid var(--phase-surface)',
              borderLeft: i > 0 ? 'none' : '1px solid var(--phase-surface)',
              background: isActive ? 'var(--phase-accent)' : 'transparent',
              cursor: 'pointer', transition: 'background 0.2s ease', outline: 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--phase-font-display, serif)',
              fontSize: '44px', fontWeight: 700,
              color: isActive ? 'var(--phase-bg)' : 'var(--phase-ink)',
              lineHeight: 1, marginBottom: '8px', transition: 'color 0.2s ease',
            }}>{count}</div>
            <div style={{
              fontSize: '9px', fontFamily: '"Inter", sans-serif',
              color: isActive ? 'var(--phase-bg)' : 'var(--phase-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500,
              transition: 'color 0.2s ease',
            }}>{label}</div>
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Timeline() {
  const params = new URLSearchParams(window.location.search);
  const initYear   = params.get('year')   ? Number(params.get('year')) : 1962;
  const initMember = params.get('member') || null;

  const [selectedYear,     setSelectedYear]     = useState(initYear);
  const [selectedMonth,    setSelectedMonth]    = useState(null);
  const [eventType,        setEventType]        = useState(null);
  const [member,           setMember]           = useState(initMember);
  const [activeStatFilter, setActiveStatFilter] = useState(null);
  const [highlights,       setHighlights]       = useState([]);

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

  const { data: monthOverviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  const yearOverview = useMemo(() =>
    yearOverviews.find(o => o.year === selectedYear),
    [yearOverviews, selectedYear]
  );

  const monthOverview = useMemo(() =>
    selectedMonth
      ? monthOverviews.find(o => o.year === selectedYear && o.month === selectedMonth)
      : null,
    [monthOverviews, selectedYear, selectedMonth]
  );

  const yearEvents = useMemo(() =>
    events
      .filter(e => e.date && new Date(e.date).getFullYear() === selectedYear)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [events, selectedYear]
  );

  // Randomly pick up to 5 highlights when the year changes or data loads
  useEffect(() => {
    if (yearEvents.length === 0) return;
    // Score: photos = 2pts, body text = 1pt, plus random jitter for variety
    const scored = yearEvents.map(e => ({
      event: e,
      score: (e.photos?.length > 0 ? 2 : 0) + (e.body ? 1 : 0) + Math.random(),
    }));
    scored.sort((a, b) => b.score - a.score);
    setHighlights(scored.slice(0, 5).map(s => s.event));
  }, [selectedYear, yearEvents.length]);

  const monthEvents = useMemo(() =>
    selectedMonth
      ? yearEvents.filter(e => new Date(e.date).getMonth() + 1 === selectedMonth)
      : [],
    [yearEvents, selectedMonth]
  );

  const typeStats = useMemo(() =>
    STAT_TYPE_MAP.map(({ label, type }) => ({
      label, type,
      count: yearEvents.filter(e => e.event_type === type).length,
    })),
    [yearEvents]
  );

  const monthStats = useMemo(() =>
    STAT_TYPE_MAP.map(({ label, type }) => ({
      label, type,
      count: monthEvents.filter(e => e.event_type === type).length,
    })),
    [monthEvents]
  );

  const filteredEvents = useMemo(() => {
    if (!selectedMonth) {
      return activeStatFilter
        ? yearEvents.filter(e => e.event_type === activeStatFilter)
        : yearEvents;
    }
    return yearEvents.filter(e => {
      if (new Date(e.date).getMonth() + 1 !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && (!e.members || !e.members.includes(member))) return false;
      if (activeStatFilter && e.event_type !== activeStatFilter) return false;
      return true;
    });
  }, [yearEvents, selectedMonth, eventType, member, activeStatFilter]);

  const isYearView = !selectedMonth;
  const headlineSizePx = Math.min(phase.headlineSizePx, 68);
  const chapterTitle = YEAR_CHAPTER_TITLES[selectedYear]; // object or undefined

  const handleStatClick = (type) => {
    setActiveStatFilter(prev => prev === type ? null : type);
  };

  const monthChapterHeading = useMemo(() => {
    if (!selectedMonth) return null;
    if (monthOverview?.key_themes) {
      const themes = monthOverview.key_themes.split(',').map(t => t.trim()).filter(Boolean);
      if (themes.length > 0 && themes[0].length < 80) return themes[0];
    }
    return null;
  }, [selectedMonth, selectedYear, monthOverview]);

  return (
    <div
      className={`phase-${phase.id}`}
      style={{ minHeight: '100vh', background: 'var(--phase-bg)', transition: 'background 0.5s ease' }}
    >
      <div className="max-w-7xl mx-auto w-full" style={{ display: 'flex', alignItems: 'flex-start' }}>

        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={y => {
            setSelectedYear(y);
            setSelectedMonth(null);
            setEventType(null);
            setMember(null);
            setActiveStatFilter(null);
          }}
          onMonthChange={m => {
            setSelectedMonth(m);
            setEventType(null);
            setMember(null);
            setActiveStatFilter(null);
          }}
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
              {/* ── Headline block ── */}
              {chapterTitle ? (
                // Structured chapter title: year in muted grey + headline + subheading
                <div style={{ marginBottom: '32px', maxWidth: '720px' }}>
                  <h1 style={{
                    fontFamily: phase.fonts.display,
                    fontSize: '48px',
                    fontWeight: phase.weights.display,
                    color: 'var(--phase-ink)',
                    lineHeight: 1.15,
                    letterSpacing: phase.headlineTracking,
                    textTransform: phase.headlineCase,
                    marginBottom: '10px',
                  }}>
                    <span style={{ color: 'var(--phase-muted)', opacity: 0.45, fontWeight: 400 }}>
                      {selectedYear}
                    </span>
                    {' – '}
                    {chapterTitle.headline}
                  </h1>
                  <p style={{
                    fontSize: '17px',
                    fontStyle: 'italic',
                    color: 'var(--phase-muted)',
                    fontFamily: phase.fonts.body,
                    lineHeight: 1.45,
                    letterSpacing: '0.01em',
                  }}>
                    {chapterTitle.subheading}
                  </p>
                </div>
              ) : (
                // Plain year title + subtitle
                <div style={{ marginBottom: '32px', maxWidth: '720px' }}>
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
                  }}>
                    {YEAR_SUBTITLES[selectedYear]}
                  </p>
                </div>
              )}

              {/* Stat strip */}
              {!isLoading && (
                <StatStrip
                  stats={typeStats}
                  activeType={activeStatFilter}
                  onStatClick={handleStatClick}
                />
              )}

              {isLoading && (
                <div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ height: '40px', background: 'var(--phase-surface)', marginBottom: '8px', opacity: 0.3 }} />
                  ))}
                </div>
              )}

              {/* Stat-filtered list OR highlights + year blog */}
              {!isLoading && activeStatFilter ? (
                <StatFilteredList
                  events={filteredEvents}
                  phase={phase}
                  label={STAT_TYPE_MAP.find(s => s.type === activeStatFilter)?.label || activeStatFilter}
                  onClear={() => setActiveStatFilter(null)}
                />
              ) : (
                !isLoading && (
                  <>
                    <YearHighlights highlights={highlights} phase={phase} />
                    <YearBlog yearOverview={yearOverview} phase={phase} year={selectedYear} />
                  </>
                )
              )}
            </>
          )}

          {/* ═══ MONTH VIEW ══════════════════════════════════════════════ */}
          {!isYearView && (
            <>
              <div style={{ marginBottom: '20px' }}>
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
                {monthChapterHeading && (
                  <p style={{
                    fontSize: '14px', fontStyle: 'italic',
                    color: 'var(--phase-muted)', fontFamily: phase.fonts.body,
                    lineHeight: 1.4, marginTop: '6px',
                  }}>
                    {monthChapterHeading}
                  </p>
                )}
              </div>

              {!isLoading && (
                <StatStrip
                  stats={monthStats}
                  activeType={activeStatFilter}
                  onStatClick={handleStatClick}
                />
              )}

              {!activeStatFilter && (
                <FilterBar
                  eventType={eventType}
                  member={member}
                  onEventTypeChange={setEventType}
                  onMemberChange={setMember}
                />
              )}

              {activeStatFilter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{
                    fontSize: '9px', fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--phase-accent)', fontWeight: 600,
                  }}>
                    Filtered: {STAT_TYPE_MAP.find(s => s.type === activeStatFilter)?.label}
                  </span>
                  <button
                    onClick={() => setActiveStatFilter(null)}
                    style={{
                      fontSize: '10px', fontFamily: '"Inter", sans-serif',
                      color: 'var(--phase-muted)', background: 'none',
                      border: '1px solid var(--phase-muted)',
                      padding: '2px 8px', cursor: 'pointer',
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--phase-ink)'; e.currentTarget.style.borderColor = 'var(--phase-ink)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--phase-muted)'; e.currentTarget.style.borderColor = 'var(--phase-muted)'; }}
                  >
                    × Clear
                  </button>
                </div>
              )}

              {isLoading ? (
                <div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ height: '60px', background: 'var(--phase-surface)', marginBottom: '2px', opacity: 0.4 }} />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--phase-muted)', fontFamily: '"Inter", sans-serif' }}>
                    No events found for {MONTH_NAMES[selectedMonth]} {selectedYear}
                    {activeStatFilter ? ` · ${STAT_TYPE_MAP.find(s => s.type === activeStatFilter)?.label}` : ''}.
                  </p>
                </div>
              ) : (
                <div>
                  {filteredEvents.map(event => (
                    <EventRow key={event.id} event={event} phase={phase} />
                  ))}
                  <p style={{
                    fontSize: '10px', color: 'var(--phase-muted)',
                    marginTop: '28px', textAlign: 'center',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontFamily: '"Inter", sans-serif', opacity: 0.6,
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
