import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const DEFAULT_MEMBERS = [
  { name: 'John Lennon', role: 'Rhythm Guitar, Vocals', years_with_beatles: '1960–1970', colour_code: '#E24B4A' },
  { name: 'Paul McCartney', role: 'Bass, Vocals', years_with_beatles: '1960–1970', colour_code: '#3B82F6' },
  { name: 'George Harrison', role: 'Lead Guitar, Vocals', years_with_beatles: '1958–1970', colour_code: '#F59E0B' },
  { name: 'Ringo Starr', role: 'Drums, Vocals', years_with_beatles: '1962–1970', colour_code: '#22C55E' },
];

export default function Members() {
  const { data: dbMembers = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => base44.entities.Member.list(),
  });

  const members = dbMembers.length > 0 ? dbMembers : DEFAULT_MEMBERS;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">The Fab Four</h1>
        <p className="text-muted-foreground text-sm">Click on a member to explore their events in the timeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map(member => (
          <Link
            key={member.name}
            to={`/timeline?member=${encodeURIComponent(member.name)}`}
            className="group block border border-border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start gap-5 p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-white font-serif text-xl font-bold"
                style={{ backgroundColor: member.colour_code || '#333' }}
              >
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  member.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold group-hover:text-accent transition-colors">
                  {member.name}
                </h2>
                <p className="text-muted-foreground text-sm">{member.role}</p>
                <p className="text-accent text-xs font-mono mt-1">{member.years_with_beatles}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{member.bio}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}