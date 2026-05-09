import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Music, Mic2, Briefcase, Apple, User, Heart, Disc3, Tv, Plane } from 'lucide-react';

const TYPE_CONFIG = {
  'Recording Session': { icon: Music, className: 'bg-primary/10 text-primary border-primary/20' },
  'Live Performance': { icon: Mic2, className: 'bg-accent/10 text-accent border-accent/20' },
  'Business/Management': { icon: Briefcase, className: 'bg-muted text-muted-foreground border-border' },
  'Apple Corps': { icon: Apple, className: 'bg-green-50 text-green-700 border-green-200' },
  'Solo Work': { icon: User, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Personal': { icon: Heart, className: 'bg-pink-50 text-pink-700 border-pink-200' },
  'Release': { icon: Disc3, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Media Appearance': { icon: Tv, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Travel': { icon: Plane, className: 'bg-sky-50 text-sky-700 border-sky-200' },
};

export default function EventTypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || { icon: Music, className: 'bg-muted text-muted-foreground border-border' };
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} gap-1 font-medium text-xs`}>
      <Icon className="w-3 h-3" />
      {type}
    </Badge>
  );
}