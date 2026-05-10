import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import EventTypeBadge from '../components/shared/EventTypeBadge';
import MemberBadge from '../components/shared/MemberBadge';
import { getPhaseForYear } from '@/lib/phases';
import { usePhase } from '@/lib/PhaseContext';

export default function EventDetail() {
  const eventId = window.location.pathname.split('/event/')[1];
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
  const currentIdx = sortedEvents.findIndex(e => String(e.id) === String(eventId));
  const prevEvent = currentIdx > 0 ? sortedEvents[currentIdx - 1] : null;
  const nextEvent = currentIdx < sortedEvents.length - 1 ? sortedEvents[currentIdx + 1] : null;

  const year = event?.date ? new Date(event.date).getFullYear() : null;
  const phase = year ? getPhaseForYear(year) : null;

  // Sync Navbar when phase is known; reset on unmount
  useEffect(() => {
    if (phase) {
      setPhaseId(phase.id);
      return () => setPhaseId(null);
    }
  }, [phase?.id, setPhaseId]);

  // ── Loading skeleton ────────────────────────────────────────────────────────
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

  // Compound class: softer detail palette + phase identity
  const rootClass = `phase-${phase.id} phase-detail`;

  return (
    <div
      className={rootClass}
      style={{ background: 'var(--phase-bg)', minHeight: '100vh', transition: 'background 0.5s' }}
    >
      {/* ── Header band ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--phase-header-bg)' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          padding: '13px 40px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '20px',
          flexWrap: 'wrap',
        }}>
          <Link
            to="/timeline"
            style={{
              fontSize: '11px',
              color: 'var(--phase-header-ink)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: '"Inter", sans-serif',
              opacity: 0.65,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}
          >
            ← Timeline
          </Link>

          <span style={{
            fontSize: '10px',
            color: 'var(--phase-header-ink)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
            opacity: 0.5,
          }}>
            {phase.label}&ensp;·&ensp;{phase.years}
          </span>

          <span style={{
            fontSize: '12px',
            fontFamily: phase.fonts.mono,
            color: 'var(--phase-header-ink)',
            opacity: 0.75,
          }}>
            {dateStr}
          </span>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────────────────────────── */}
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
              fontSize: '10px',
              color: 'var(--phase-muted)',
              border: '1px solid var(--phase-muted)',
              padding: '2px 8px',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Photos */}
        {event.photos && event.photos.length > 0 && (
          <div style={{ marginBottom: '40px', disp