import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EVENT_TYPES = ['Recording Session', 'Live Performance', 'Business/Management', 'Apple Corps', 'Solo Work', 'Personal', 'Release', 'Media Appearance', 'Travel'];
const MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr', 'Pete Best', 'Stuart Sutcliffe'];

export default function FilterBar({ eventType, member, onEventTypeChange, onMemberChange }) {
  const hasFilters = eventType || member;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Filter className="w-4 h-4 text-muted-foreground" />
      <Select value={eventType || 'all'} onValueChange={v => onEventTypeChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-48 h-8 text-xs">
          <SelectValue placeholder="Event type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={member || 'all'} onValueChange={v => onMemberChange(v === 'all' ? null : v)}>
        <SelectTrigger className="w-48 h-8 text-xs">
          <SelectValue placeholder="Member" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Members</SelectItem>
          {MEMBERS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { onEventTypeChange(null); onMemberChange(null); }}>
          <X className="w-3 h-3 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}