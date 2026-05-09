import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const DEFAULT_MEMBERS = [
  { name: 'John Lennon', role: 'Rhythm Guitar, Vocals', years_with_beatles: '1960–1970', colour_code: '#C8102E' },
  { name: 'Paul McCartney', role: 'Bass, Vocals', years_with_beatles: '1960–1970', colour_code: '#111111' },
  { name: 'George Harrison', role: 'Lead Guitar, Vocals', years_with_beatles: '1958–1970', colour_code: '#111111' },
  { name: 'Ringo Starr', role: 'Drums, Vocals', years_with_beatles: '1962–1970', colour_code: '#111111' },
];

export default function Members() {
  const { data: dbMembers = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => base44.entities.Member.list(),
  });

  const members = dbMembers.length > 0 ? dbMembers : DEFAULT_MEMBERS;

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>Members</h1>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '36px' }}>Click on a member to view their events in the timeline.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '0' }}>
          {members.map((member, idx) => (
            <Link
              key={member.name}
              to={`/timeline?member=${encodeURIComponent(member.name)}`}
              style={{
                textDecoration: 'none', display: 'block',
                border: '1px solid #E5E5E5',
                marginTop: idx > 0 ? '-1px' : 0,
                padding: '24px',
                background: '#FFFFFF',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#AAAAAA'; e.currentTarget.style.zIndex = '1'; e.currentTarget.style.position = 'relative'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.zIndex = '0'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '56px', height: '56px', flexShrink: 0,
                  border: '1px solid #E5E5E5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#F7F7F7',
                }}>
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '18px', fontWeight: 500, color: '#666666' }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#111111', marginBottom: '3px' }}>{member.name}</h2>
                  <p style={{ fontSize: '13px', color: '#666666', marginBottom: '4px' }}>{member.role}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#C8102E' }}>{member.years_with_beatles}</p>
                  {member.bio && (
                    <p style={{ fontSize: '13px', color: '#888888', marginTop: '10px', lineHeight: '1.6', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}