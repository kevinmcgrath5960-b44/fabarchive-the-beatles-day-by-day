import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function OnThisDayHero({ events }) {
  const today = new Date();
  const dayMonth = format(today, 'd MMMM');

  if (!events || events.length === 0) {
    return (
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50">On This Day</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{dayMonth}</h1>
          <p className="text-primary-foreground/60 text-sm">No recorded Beatles events on this date. Browse the timeline to explore their history.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50">On This Day</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8">{dayMonth}</h1>
        <div className="space-y-6">
          {events.slice(0, 5).map(event => {
            const year = new Date(event.date).getFullYear();
            return (
              <Link key={event.id} to={`/event/${event.id}`} className="group block">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded font-mono">
                    {year}
                  </span>
                  <div>
                    <h2 className="font-serif text-lg md:text-xl font-semibold group-hover:text-accent transition-colors leading-snug">
                      {event.title}
                    </h2>
                    {event.body && (
                      <p className="text-primary-foreground/50 text-sm mt-1 line-clamp-2">
                        {event.body.substring(0, 200)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}