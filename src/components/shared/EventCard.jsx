import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import EventTypeBadge from './EventTypeBadge';

export default function EventCard({ event, variant = 'default' }) {
  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : event.date ? format(new Date(event.date), 'd MMMM yyyy') : '';

  if (variant === 'featured') {
    return (
      <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article style={{
          border: '1px solid #E5E5E5',
          background: '#FFFFFF',
          padding: '20px',
          height: '100%',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#BBBBBB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
        >
          {event.photos?.[0]?.url && (
            <div style={{ marginBottom: '14px', overflow: 'hidden', aspectRatio: '16/9' }}>
              <img
                src={event.photos[0].url}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#C8102E', marginBottom: '8px' }}>{dateStr}</p>
          <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#111111', marginBottom: '8px', lineHeight: '1.4' }}>{event.title}</h3>
          {event.body && (
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '12px', lineHeight: '1.5' }}>
              {event.body.substring(0, 140)}…
            </p>
          )}
          {event.event_type && <EventTypeBadge type={event.event_type} />}
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{ padding: '14px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: '20px', alignItems: 'flex-start' }}
        onMouseEnter={e => e.currentTarget.querySelector('h3').style.color = '#C8102E'}
        onMouseLeave={e => e.currentTarget.querySelector('h3').style.color = '#111111'}
      >
        <div style={{ flexShrink: 0, width: '110px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#C8102E', lineHeight: '1.4' }}>{dateStr}</p>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#111111', marginBottom: '4px', lineHeight: '1.4', transition: 'color 0.1s' }}>{event.title}</h3>
          {event.body && (
            <p style={{ fontSize: '13px', color: '#666666', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {event.body.substring(0, 150)}
            </p>
          )}
          {event.event_type && (
            <div style={{ marginTop: '6px' }}>
              <EventTypeBadge type={event.event_type} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}