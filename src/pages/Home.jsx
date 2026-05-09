import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import OnThisDayHero from '../components/home/OnThisDayHero';
import YearSelector from '../components/home/YearSelector';
import StatsBar from '../components/home/StatsBar';
import EventCard from '../components/shared/EventCard';

export default function Home() {
  const today = new Date();
  const dayStr = String(today.getDate()).padStart(2, '0');
  const monthStr = String(today.getMonth() + 1).padStart(2, '0');

  const { data: allEvents = [] } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('-date', 500),
  });

  const onThisDayEvents = allEvents.filter(e => {
    const d = e.date;
    return d && d.substring(5, 7) === monthStr && d.substring(8, 10) === dayStr;
  });

  const featuredEvents = allEvents.filter(e => e.is_featured).slice(0, 3);
  const totalEvents = allEvents.length;

  return (
    <div>
      <OnThisDayHero events={onThisDayEvents} />

      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          A comprehensive day-by-day chronicle of The Beatles, covering every recording session, 
          live performance, business decision, and personal milestone from 1962 to 1971.
        </p>
        <YearSelector />
      </section>

      {featuredEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} variant="featured" />
            ))}
          </div>
        </section>
      )}

      <StatsBar totalEvents={totalEvents} />
    </div>
  );
}