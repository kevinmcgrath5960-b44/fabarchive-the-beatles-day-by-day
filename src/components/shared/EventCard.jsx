import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import EventTypeBadge from './EventTypeBadge';
import MemberBadge from './MemberBadge';

export default function EventCard({ event, variant = 'default' }) {
  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : format(new Date(event.date), 'd MMMM yyyy');

  if (variant === 'featured') {
    return (
      <Link to={`/event/${event.id}`} className="group block">
        <article className="border border-border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden">
          {event.photos?.[0]?.url && (
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={event.photos[0].url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-5">
            <p className="text-accent font-mono text-xs font-medium mb-2">{dateStr}</p>
            <h3 className="font-serif text-lg font-semibold leading-snug group-hover:text-accent transition-colors">
              {event.title}
            </h3>
            {event.body && (
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{event.body.substring(0, 150)}...</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {event.event_type && <EventTypeBadge type={event.event_type} />}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/event/${event.id}`} className="group block">
      <article className="flex gap-4 py-4 border-b border-border hover:bg-muted/30 transition-colors px-2 -mx-2 rounded">
        <div className="shrink-0 w-24 text-right">
          <p className="text-accent font-mono text-sm font-medium">{dateStr}</p>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm group-hover:text-accent transition-colors leading-snug">
            {event.title}
          </h3>
          {event.body && (
            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{event.body.substring(0, 120)}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {event.event_type && <EventTypeBadge type={event.event_type} />}
            {event.members?.map(m => <MemberBadge key={m} name={m} />)}
          </div>
        </div>
      </article>
    </Link>
  );
}