import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function OnThisDayHero({ events }) {
  const today = new Date();
  const dayMonth = format(today, 'd MMMM');

  return (
    <section style={{ background: '#111111', borderBottom: '1px solid #333333' }}>
      <div className="max-w-4xl mx-auto px-6 py-14 text-center">
        <p style={{ fontSize: '11px', color: '#C8102E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
          On This Day
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: 300, color: '#FFFFFF', marginBottom: '40px', letterSpacing: '-0.01em', lineHeight: 1 }}>
          {dayMonth}
        </h1>

        {events && events.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
            {events.slice(0, 5).map(event => {
              const year = new Date(event.date).getFullYear();
              return (
                <Link key={event.id} to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'left',
                    padding: '14px 0', borderBottom: '1px solid #222222',
                  }}
                    onMouseEnter={e => e.currentTarget.querySelector('p:last-child').style.color = '#DDDDDD'}
                    onMouseLeave={e => e.currentTarget.querySelector('p:last-child').style.color = '#AAAAAA'}
                  >
                    <span style={{ flexShrink: 0, fontFamily: 'monospace', fontSize: '13px', color: '#C8102E', fontWeight: 500, paddingTop: '1px' }}>
                      {year}
                    </span>
                    <p style={{ fontSize: '15px', color: '#AAAAAA', lineHeight: '1.5', transition: 'color 0.1s', margin: 0 }}>
                      {event.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: '#999999' }}>No Beatles events recorded on this date.</p>
        )}
      </div>
    </section>
  );
}