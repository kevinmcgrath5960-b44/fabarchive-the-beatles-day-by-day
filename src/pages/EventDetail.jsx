import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventTypeBadge from '../components/shared/EventTypeBadge';
import MemberBadge from '../components/shared/MemberBadge';

export default function EventDetail() {
  const params = new URLSearchParams(window.location.search);
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

  const sortedEvents = allEvents.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const currentIdx = sortedEvents.findIndex(e => String(e.id) === String(eventId));
  const prevEvent = currentIdx > 0 ? sortedEvents[currentIdx - 1] : null;
  const nextEvent = currentIdx < sortedEvents.length - 1 ? sortedEvents[currentIdx + 1] : null;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Event not found.</p>
        <Link to="/timeline" className="text-accent text-sm mt-2 inline-block hover:underline">Back to Timeline</Link>
      </div>
    );
  }

  const dateStr = event.approximate_date && event.approximate_description
    ? event.approximate_description
    : format(new Date(event.date), 'EEEE, d MMMM yyyy');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/timeline" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Timeline
      </Link>

      <article>
        <p className="text-accent font-mono text-sm font-medium mb-2">{dateStr}</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4">{event.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {event.event_type && <EventTypeBadge type={event.event_type} />}
          {event.members?.map(m => <MemberBadge key={m} name={m} />)}
          {event.tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">#{tag}</span>
          ))}
        </div>

        {event.photos && event.photos.length > 0 && (
          <div className="mb-8 grid gap-4">
            {event.photos.map((photo, i) => (
              <figure key={i} className="overflow-hidden border border-border">
                <img src={photo.url} alt={photo.caption || event.title} className="w-full" />
                {(photo.caption || photo.credit) && (
                  <figcaption className="p-3 text-xs text-muted-foreground bg-muted/50">
                    {photo.caption && <span>{photo.caption}</span>}
                    {photo.credit && <span className="italic ml-2">— {photo.credit}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {event.body && (
          <div className="prose prose-sm max-w-none prose-headings:font-serif prose-a:text-accent">
            <ReactMarkdown>{event.body}</ReactMarkdown>
          </div>
        )}

        {event.sources && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sources & References</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{event.sources}</p>
          </div>
        )}
      </article>

      <nav className="mt-12 pt-6 border-t border-border flex justify-between">
        {prevEvent ? (
          <Link to={`/event/${prevEvent.id}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="font-medium group-hover:text-accent transition-colors line-clamp-1">{prevEvent.title}</p>
            </div>
          </Link>
        ) : <div />}
        {nextEvent ? (
          <Link to={`/event/${nextEvent.id}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right">
            <div>
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="font-medium group-hover:text-accent transition-colors line-clamp-1">{nextEvent.title}</p>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}