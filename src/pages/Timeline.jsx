import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TimelineSidebar from '../components/timeline/TimelineSidebar';
import FilterBar from '../components/timeline/FilterBar';
import EventCard from '../components/shared/EventCard';
import ReactMarkdown from 'react-markdown';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Timeline() {
  const params = new URLSearchParams(window.location.search);
  const initYear = params.get('year') ? Number(params.get('year')) : 1962;
  const initMember = params.get('member') || null;

  const [selectedYear, setSelectedYear] = useState(initYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [eventType, setEventType] = useState(null);
  const [member, setMember] = useState(initMember);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('date', 2000),
  });

  const { data: overviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      if (d.getFullYear() !== selectedYear) return false;
      if (selectedMonth && d.getMonth() + 1 !== selectedMonth) return false;
      if (eventType && e.event_type !== eventType) return false;
      if (member && (!e.members || !e.members.includes(member))) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [events, selectedYear, selectedMonth, eventType, member]);

  const currentOverview = overviews.find(o => o.year === selectedYear && o.month === selectedMonth);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse Beatles history day by day</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <TimelineSidebar
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={(y) => { setSelectedYear(y); setSelectedMonth(null); }}
          onMonthChange={setSelectedMonth}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-4">
            <h2 className="font-serif text-2xl font-semibold">{selectedYear}</h2>
            {selectedMonth && (
              <span className="text-accent font-medium">{MONTH_NAMES[selectedMonth]}</span>
            )}
          </div>

          <FilterBar eventType={eventType} member={member} onEventTypeChange={setEventType} onMemberChange={setMember} />

          {currentOverview?.overview_text && (
            <div className="bg-muted/50 border border-border rounded p-4 mb-6 prose prose-sm max-w-none text-muted-foreground">
              <ReactMarkdown>{currentOverview.overview_text}</ReactMarkdown>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">No events found for this period.</p>
              <p className="text-xs mt-1">Try adjusting your filters or selecting a different month.</p>
            </div>
          ) : (
            <div>
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              <p className="text-xs text-muted-foreground mt-6 text-center">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}