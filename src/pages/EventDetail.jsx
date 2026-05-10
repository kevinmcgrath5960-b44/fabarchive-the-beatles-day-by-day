import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import EventTypeBadge from '../components/shared/EventTypeBadge';
import MemberBadge from '../components/shared/MemberBadge';
import { getPhaseForYear } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

// ── Parse inline image alt text for size hints ────────────────────────────────
// Syntax: ![My caption|half](url)  →  caption="My caption", size="half"
// Supported sizes: full (default), half, third, right, left
function parseImageAlt(alt = '') {
  const [caption, sizeHint] = alt.split('|').map(s => s.trim());
  return { caption, size: sizeHint?.toLowerCase() || 'full' };
}

// Width + layout per size token
const IMAGE_SIZE_STYLES = {
  full:  { wrapper: { width: '100%', margin: '2em 0', clear: 'both' } },
  half:  { wrapper: { width: '50%', margin: '2em auto', display: 'block', clear: 'both' } },
  third: { wrapper: { width: '33.333%', margin: '2em auto', display: 'block', clear: 'both' } },
  right: { wrapper: { width: '40%', float: 'right', margin: '0.4em 0 1.2em 2em' } },
  left:  { wrapper: { width: '40%', float: 'left',  margin: '0.4em 2em 1.2em 0' } },
};

export default function EventDetail() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { setPhaseId } = usePhase();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const events = await base44.entities.Event.list('date', 2000);
      return events.find(e => String(e.id) === String(eventId));
    },
    enabled: !!eventId,
  });

  const { data: allEvents = [] } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  const sortedEvents = [...allEvents].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const currentIdx  = sortedEvents.findIndex(e => String(e.id) === String(eventId));
  const prevEvent   = currentIdx > 0 ? sortedEvents[currentIdx - 1] : null;
  const nextEvent   = currentIdx < sortedEvents.length - 1 ? sortedEvents[currentIdx + 1] : null;

  const year  = event?.date ? new Date(event.date).getFullYear() : null;
  const phase = year ? getPhaseForYear(year) : null;

  useEffect(() => {
    if (phase) {
      setPhaseId(phase.id);
      return () => setPhaseId(null);
    }
  }, [phase?.id, setPhaseId]);

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ background: '#F4ECDC', minHeight: '100vh' }}>
        <div style={{ height: '48px', background: '#1A1614' }} />
        <div style={{ maxWidth: '720px', margin: '48px auto', padding: '0 40px' }}>
          {[200, 300, 180].map((w, i) => (
            <div key={i} style={{ height: i === 1 ? '52px' : '20px', background: 'rgba(0,0,0,0.07)', marginBottom: '16px', width: `${w}px` }} />
          ))}
          <div style={{ height: '300px', background: 'rgba(0,0,0,0.05)', marginTop: '32px' }} />
        </div>
      </div>
    );
  }

  if (!event || !phase) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Event not found.</p>
        <Link to="/timeline" style={{ color: '#C8102E', fontSize: '13px', textDecoration: 'none' }}>
          ← Back to Timeline
        </Link>
      </div>
    );
  }

  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : format(new Date(event.date), 'EEEE, d MMMM yyyy');

  const rootClass = `phase-${phase.id} phase-detail`;

  // ── Inline image renderer for ReactMarkdown ───────────────────────────────────
  const InlineImage = ({ src, alt }) => {
    const { caption, size } = parseImageAlt(alt);
    const { wrapper } = IMAGE_SIZE_STYLES[size] || IMAGE_SIZE_STYLES.full;
    return (
      <figure style={{ margin: 0, ...wrapper }}>
        <img
          src={src}
          alt={caption}
          style={{ width: '100%', display: 'block' }}
        />
        {caption && (
          <figcaption style={{
            fontSize: '11px',
            color: 'var(--phase-muted)',
            background: 'var(--phase-surface)',
            padding: '8px 12px',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}>
            {caption}
          </figcaption>
        )}
      </figure>
    );
  };

  return (
    <div
      className={rootClass}
      style={{ background: 'var(--phase-bg)', minHeight: '100vh', transition: 'background 0.5s' }}
    >
      {/* ── Header band ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--phase-header-bg)' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto', padding: '13px 40px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              fontSize: '11px', color: 'var(--phase-header-ink)',
              textDecoration: 'none', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontFamily: '"Inter", sans-serif',
              opacity: 0.65, display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'opacity 0.15s', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
          >
            ← Back
          </button>
          <span style={{
            fontSize: '10px', color: 'var(--phase-header-ink)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif', opacity: 0.5,
          }}>
            {phase.label}&ensp;·&ensp;{phase.years}
          </span>
          <span style={{
            fontSize: '12px', fontFamily: phase.fonts.mono,
            color: 'var(--phase-header-ink)', opacity: 0.75,
          }}>
            {dateStr}
          </span>
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '52px 40px 88px' }}>

        {/* Title */}
        <h1 style={{
          fontFamily: phase.fonts.display,
          fontSize: 'clamp(26px, 4vw, 46px)',
          fontWeight: phase.weights.display,
          color: 'var(--phase-ink)',
          lineHeight: 1.15,
          letterSpacing: phase.headlineTracking,
          textTransform: phase.headlineCase,
          marginBottom: '24px',
        }}>
          {event.title}
        </h1>

        {/* Metadata chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px', alignItems: 'center' }}>
          {event.event_type && <EventTypeBadge type={event.event_type} />}
          {event.members?.map(m => <MemberBadge key={m} name={m} />)}
          {event.location && (
            <span style={{
              fontSize: '12px', color: 'var(--phase-muted)',
              fontFamily: '"Inter", sans-serif', letterSpacing: '0.02em',
            }}>
              · {event.location}
            </span>
          )}
          {event.tags?.map(tag => (
            <span key={tag} style={{
              fontSize: '10px', color: 'var(--phase-muted)',
              border: '1px solid var(--phase-muted)', padding: '2px 8px',
              fontFamily: '"Inter", sans-serif', letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Top photos — from the photos array, with optional size control */}
        {event.photos && event.photos.length > 0 && (
          <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {event.photos.map((photo, i) => {
              const sizeKey = photo.size || 'full';
              const widthMap = { full: '100%', half: '50%', third: '33.333%' };
              const width = widthMap[sizeKey] || '100%';
              return (
                <figure key={i} style={{ margin: '0 auto', width }}>
                  <img
                    src={photo.url}
                    alt={photo.caption || event.title}
                    style={{ width: '100%', display: 'block' }}
                  />
                  {(photo.caption || photo.credit) && (
                    <figcaption style={{
                      padding: '10px 14px', fontSize: '11px',
                      color: 'var(--phase-muted)', background: 'var(--phase-surface)',
                      fontFamily: '"Inter", sans-serif', lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}>
                      {photo.caption}
                      {photo.credit && <em style={{ opacity: 0.8 }}> — {photo.credit}</em>}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}

        {/* Body text with full markdown support */}
        {event.body && (
          <div
            className="phase-drop-cap"
            style={{
              fontSize: '15px', color: 'var(--phase-ink)',
              lineHeight: 1.85, fontFamily: phase.fonts.body,
              fontWeight: phase.weights.body,
            }}
          >
            <ReactMarkdown
              components={{
                // ── Block elements ──────────────────────────────────────────
                p: ({ children }) => (
                  <p style={{ marginBottom: '1.5em' }}>{children}</p>
                ),

                h2: ({ children }) => (
                  <h2 style={{
                    fontFamily: phase.fonts.display,
                    fontSize: '24px',
                    fontWeight: phase.weights.display,
                    color: 'var(--phase-ink)',
                    lineHeight: 1.25,
                    letterSpacing: phase.headlineTracking,
                    margin: '2.2em 0 0.7em',
                    paddingBottom: '0.4em',
                    borderBottom: '1px solid var(--phase-surface)',
                  }}>
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 style={{
                    fontFamily: phase.fonts.display,
                    fontSize: '18px',
                    fontWeight: phase.weights.display,
                    color: 'var(--phase-ink)',
                    lineHeight: 1.3,
                    letterSpacing: phase.headlineTracking,
                    margin: '1.8em 0 0.5em',
                  }}>
                    {children}
                  </h3>
                ),

                h4: ({ children }) => (
                  <h4 style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--phase-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '1.6em 0 0.4em',
                  }}>
                    {children}
                  </h4>
                ),

                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid var(--phase-accent)',
                    margin: '1.8em 0',
                    paddingLeft: '20px',
                    color: 'var(--phase-muted)',
                    fontStyle: 'italic',
                  }}>
                    {children}
                  </blockquote>
                ),

                hr: () => (
                  <hr style={{
                    border: 'none',
                    borderTop: '1px solid var(--phase-surface)',
                    margin: '2.5em 0',
                  }} />
                ),

                ul: ({ children }) => (
                  <ul style={{
                    paddingLeft: '1.4em', marginBottom: '1.5em',
                    color: 'var(--phase-ink)',
                  }}>
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol style={{
                    paddingLeft: '1.4em', marginBottom: '1.5em',
                    color: 'var(--phase-ink)',
                  }}>
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li style={{ marginBottom: '0.4em', lineHeight: 1.7 }}>{children}</li>
                ),

                // ── Inline images with size hints ───────────────────────────
                img: ({ src, alt }) => <InlineImage src={src} alt={alt} />,

                // ── Inline elements ─────────────────────────────────────────
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--phase-ink)', fontWeight: 600 }}>{children}</strong>
                ),

                em: ({ children }) => (
                  <em style={{ color: 'var(--phase-ink)', fontStyle: 'italic' }}>{children}</em>
                ),

                a: ({ href, children }) => (
                  <a href={href} style={{
                    color: 'var(--phase-accent)', textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}>
                    {children}
                  </a>
                ),

                code: ({ children }) => (
                  <code style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    background: 'var(--phase-surface)',
                    padding: '1px 6px',
                    color: 'var(--phase-accent)',
                  }}>
                    {children}
                  </code>
                ),
              }}
            >
              {event.body}
            </ReactMarkdown>
          </div>
        )}

        {/* Sources */}
        {event.sources && (
          <div style={{
            marginTop: '44px', paddingTop: '20px',
            borderTop: '1px solid var(--phase-muted)', opacity: 0.6,
          }}>
            <p style={{
              fontSize: '9px', color: 'var(--phase-muted)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '8px', fontFamily: '"Inter", sans-serif', fontWeight: 500,
            }}>
              Sources
            </p>
            <p style={{
              fontSize: '12px', color: 'var(--phase-muted)',
              lineHeight: 1.75, whiteSpace: 'pre-line',
              fontFamily: '"Inter", sans-serif',
            }}>
              {event.sources}
            </p>
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav style={{
          marginTop: '60px', paddingTop: '24px',
          borderTop: '2px solid var(--phase-accent)',
          display: 'flex', justifyContent: 'space-between', gap: '24px',
        }}>
          {prevEvent ? (
            <Link to={`/event/${prevEvent.id}`} style={{ textDecoration: 'none', flex: 1 }}>
              <p style={{
                fontSize: '9px', color: 'var(--phase-muted)', marginBottom: '6px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: '"Inter", sans-serif', fontWeight: 500,
              }}>← Previous</p>
              <p
                style={{
                  fontSize: '13px', color: 'var(--phase-ink)', lineHeight: 1.4,
                  fontFamily: phase.fonts.body, transition: 'color 0.15s',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--phase-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--phase-ink)'}
              >
                {prevEvent.title}
              </p>
            </Link>
          ) : <div />}

          {nextEvent ? (
            <Link to={`/event/${nextEvent.id}`} style={{ textDecoration: 'none', flex: 1, textAlign: 'right' }}>
              <p style={{
                fontSize: '9px', color: 'var(--phase-muted)', marginBottom: '6px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: '"Inter", sans-serif', fontWeight: 500,
              }}>Next →</p>
              <p
                style={{
                  fontSize: '13px', color: 'var(--phase-ink)', lineHeight: 1.4,
                  fontFamily: phase.fonts.body, transition: 'color 0.15s',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--phase-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--phase-ink)'}
              >
                {nextEvent.title}
              </p>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </div>
  );
}
