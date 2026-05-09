import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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

  return (
    <div>
      <OnThisDayHero events={onThisDayEvents} />

      {/* Intro + Year selector */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.7', marginBottom: '28px' }}>
            A comprehensive day-by-day chronicle of The Beatles, covering every recording session,
            live performance, business decision, and personal milestone from 1962 to 1971.
          </p>
          <YearSelector />
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '40px 0' }}>
          <div className="max-w-6xl mx-auto px-6">
            <p style={{ fontSize: '13px', color: '#999999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
              Featured Events
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <StatsBar totalEvents={allEvents.length} />
    </div>
  );
}