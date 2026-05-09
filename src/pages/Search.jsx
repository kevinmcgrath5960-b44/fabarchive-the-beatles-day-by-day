import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-2">Search</h1>
      <p className="text-muted-foreground text-sm mb-8">Search across all Beatles events</p>

      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events, people, places..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10 h-12 text-base border-border"
          autoFocus
        />
      </div>

      {query.length >= 2 && (
        <div>
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground text-sm">
              No events match "{query}"
            </p>
          ) : (
            results.map(event => <EventCard key={event.id} event={event} />)
          )}
        </div>
      )}

      {query.length < 2 && (
        <p className="text-center py-12 text-muted-foreground text-sm">
          Type at least 2 characters to search
        </p>
      )}
    </div>
  );
}