import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import EventTypeBadge from '../components/shared/EventTypeBadge';
import MemberBadge from '../components/shared/MemberBadge';

export default function EventDetail() {
  const eventId = window.location.pathname.split('/event/')[1];

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

  if (isLoading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ height: '24px', background: '#F0F0F0', marginBottom: '12px', width: '120px' }} />
        <div style={{ height: '40px', background: '#F0F0F0', marginBottom: '20px' }} />
        <div style={{ height: '200px', background: '#F0F0F0' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: '#666666', fontSize: '14px' }}>Event not found.</p>
        <Link to="/timeline" style={{ color: '#C8102E', fontSize: '13px', textDecoration: 'none' }}>Back to Timeline</Link>
      </div>
    );
  }

  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : format(new Date(event.date), 'EEEE, d MMMM yyyy');

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <Link to="/timeline" style={{
          fontSize: '13px', color: '#666666', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '32px',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#111111'}
          onMouseLeave={e => e.currentTarget.style.color = '#666666'}
        >
          ← Back to Timeline
        </Link>

        <article>
          <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#C8102E', marginBottom: '10px' }}>{dateStr}</p>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: '#111111', lineHeight: '1.3', marginBottom: '16px' }}>{event.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
            {event.event_type && <EventTypeBadge type={event.event_type} />}
            {event.members?.map(m => <MemberBadge key={m} name={m} />)}
            {event.tags?.map(tag => (
              <span key={tag} style={{ fontSize: '11px', color: '#999999', border: '1px solid #EEEEEE', padding: '2px 7px', borderRadius: '3px' }}>
                {tag}
              </span>
            ))}
          </div>

          {event.photos && event.photos.length > 0 && (
            <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {event.photos.map((photo, i) => (
                <figure key={i} style={{ margin: 0, border: '1px solid #E5E5E5' }}>
                  <img src={photo.url} alt={photo.caption || event.title} style={{ width: '100%', display: 'block' }} />
                  {(photo.caption || photo.credit) && (
                    <figcaption style={{ padding: '10px 12px', fontSize: '12px', color: '#888888', background: '#FAFAFA', borderTop: '1px solid #EEEEEE' }}>
                      {photo.caption}{photo.credit && <span style={{ fontStyle: 'italic' }}> — {photo.credit}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {event.body && (
            <div style={{ fontSize: '15px', color: '#222222', lineHeight: '1.8' }}
              className="prose-content"
            >
              <ReactMarkdown>{event.body}</ReactMarkdown>
            </div>
          )}

          {event.sources && (
            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #E5E5E5' }}>
              <p style={{ fontSize: '11px', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Sources</p>
              <p style={{ fontSize: '13px', color: '#666666', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{event.sources}</p>
            </div>
          )}
        </article>

        {/* Prev/Next navigation */}
        <nav style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          {prevEvent ? (
            <Link to={`/event/${prevEvent.id}`} style={{ textDecoration: 'none', flex: 1 }}
              onMouseEnter={e => e.currentTarget.querySelector('.nav-title').style.color = '#C8102E'}
              onMouseLeave={e => e.currentTarget.querySelector('.nav-title').style.color = '#111111'}
            >
              <p style={{ fontSize: '11px', color: '#999999', marginBottom: '4px' }}>← Previous</p>
              <p className="nav-title" style={{ fontSize: '14px', color: '#111111', lineHeight: '1.4', transition: 'color 0.1s', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prevEvent.title}</p>
            </Link>
          ) : <div />}
          {nextEvent ? (
            <Link to={`/event/${nextEvent.id}`} style={{ textDecoration: 'none', flex: 1, textAlign: 'right' }}
              onMouseEnter={e => e.currentTarget.querySelector('.nav-title').style.color = '#C8102E'}
              onMouseLeave={e => e.currentTarget.querySelector('.nav-title').style.color = '#111111'}
            >
              <p style={{ fontSize: '11px', color: '#999999', marginBottom: '4px' }}>Next →</p>
              <p className="nav-title" style={{ fontSize: '14px', color: '#111111', lineHeight: '1.4', transition: 'color 0.1s', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{nextEvent.title}</p>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </div>
  );
}