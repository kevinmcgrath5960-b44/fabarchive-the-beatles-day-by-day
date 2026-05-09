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

  const monthTitle = selectedMonth
    ? `${MONTH_NAMES[selectedMonth]} ${selectedYear}`
    : String(selectedYear);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111', marginBottom: '24px' }}>Timeline</h1>

        <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}>
          <TimelineSidebar
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={(y) => { setSelectedYear(y); setSelectedMonth(null); }}
            onMonthChange={setSelectedMonth}
          />

          <div style={{ flex: 1, minWidth: 0, paddingLeft: '32px', borderLeft: 'none' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#111111', marginBottom: '6px' }}>{monthTitle}</h2>

            {currentOverview?.overview_text && (
              <div style={{ fontSize: '14px', color: '#666666', lineHeight: '1.7', marginBottom: '16px', maxWidth: '680px' }}>
                <ReactMarkdown>{currentOverview.overview_text}</ReactMarkdown>
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #E5E5E5', marginBottom: '20px' }} />

            <FilterBar eventType={eventType} member={member} onEventTypeChange={setEventType} onMemberChange={setMember} />

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ height: '60px', background: '#F5F5F5', marginBottom: '1px' }} />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#999999' }}>No events found for this period.</p>
              </div>
            ) : (
              <div>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
                <p style={{ fontSize: '12px', color: '#BBBBBB', marginTop: '24px', textAlign: 'center' }}>
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}