import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

export default function StatsBar({ totalEvents }) {
  return (
    <div className="border-y border-border bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-8 md:gap-16">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-accent" />
          <div>
            <p className="text-2xl font-bold font-mono">{totalEvents || '—'}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Events Documented</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-accent" />
          <div>
            <p className="text-2xl font-bold font-mono">10</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Years Covered</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-accent" />
          <div>
            <p className="text-2xl font-bold font-mono">4</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Band Members</p>
          </div>
        </div>
      </div>
    </div>
  );
}