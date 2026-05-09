import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import EventCard from '../components/shared/EventCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const { data: events = [] } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return events.filter(e => {
      const title = (e.title || '').toLowerCase();
      const body = (e.body || '').toLowerCase();
      const tags = (e.tags || []).join(' ').toLowerCase();
      return title.includes(q) || body.includes(q) || tags.includes(q);
    }).slice(0, 50);
  }, [events, query]);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111111', marginBottom: '24px' }}>Search</h1>

        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="Search events, people, places..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%', height: '44px', padding: '0 14px',
              fontSize: '15px', color: '#111111',
              border: '1px solid #CCCCCC', background: '#FFFFFF',
              outline: 'none', borderRadius: '0',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#111111'}
            onBlur={e => e.target.style.borderColor = '#CCCCCC'}
          />
        </div>

        {query.length >= 2 && (
          <div>
            <p style={{ fontSize: '12px', color: '#999999', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#999999', textAlign: 'center', padding: '48px 0' }}>
                No events match "{query}"
              </p>
            ) : (
              results.map(event => <EventCard key={event.id} event={event} />)
            )}
          </div>
        )}

        {query.length < 2 && (
          <p style={{ fontSize: '14px', color: '#BBBBBB', textAlign: 'center', padding: '48px 0' }}>
            Type at least 2 characters to search
          </p>
        )}
      </div>
    </div>
  );
}