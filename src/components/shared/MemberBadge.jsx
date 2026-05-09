import React from 'react';

const MEMBER_COLORS = {
  'John Lennon': 'bg-red-100 text-red-800',
  'Paul McCartney': 'bg-blue-100 text-blue-800',
  'George Harrison': 'bg-orange-100 text-orange-800',
  'Ringo Starr': 'bg-green-100 text-green-800',
  'Pete Best': 'bg-gray-100 text-gray-700',
  'Stuart Sutcliffe': 'bg-purple-100 text-purple-800',
};

export default function MemberBadge({ name }) {
  const colorClass = MEMBER_COLORS[name] || 'bg-muted text-muted-foreground';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {name}
    </span>
  );
}