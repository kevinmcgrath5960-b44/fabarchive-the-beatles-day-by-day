import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const btnBase = {
  fontSize: '12px', padding: '4px 10px', border: '1px solid #E5E5E5',
  background: '#FFFFFF', color: '#444444', cursor: 'pointer', borderRadius: '0',
};

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => base44.entities.Event.list('-date', 2000),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-all'] });
      toast({ title: 'Event deleted' });
      setDeleteId(null);
    },
  });

  const filtered = events.filter(e => (e.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111' }}>Events</h1>
        <Link to="/admin/events/new" style={{
          display: 'inline-block', padding: '8px 16px', fontSize: '13px', fontWeight: 500,
          background: '#C8102E', color: '#FFFFFF', textDecoration: 'none', borderRadius: '0',
        }}>
          + New Event
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', maxWidth: '360px', height: '36px', padding: '0 12px',
          fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF',
          outline: 'none', marginBottom: '12px', boxSizing: 'border-box',
        }}
      />

      <p style={{ fontSize: '12px', color: '#999999', marginBottom: '12px' }}>{filtered.length} events</p>

      {isLoading ? (
        <div>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: '40px', background: '#F5F5F5', marginBottom: '1px' }} />)}</div>
      ) : (
        <div style={{ border: '1px solid #E5E5E5' }}>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F7F7', borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'table-cell' }} className="hidden sm:table-cell">Type</th>
                <th style={{ padding: '9px 12px', width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => (
                <tr key={event.id} style={{ borderBottom: '1px solid #F0F0F0', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                  <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#C8102E', whiteSpace: 'nowrap' }}>
                    {event.date ? format(new Date(event.date), 'dd MMM yyyy') : '—'}
                  </td>
                  <td style={{ padding: '9px 12px', color: '#111111', maxWidth: '320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {event.is_featured && <span style={{ fontSize: '10px', color: '#C8102E' }}>★</span>}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 12px', fontSize: '12px', color: '#666666' }} className="hidden sm:table-cell">
                    {event.event_type || '—'}
                  </td>
                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <Link to={`/admin/events/${event.id}`} style={{ ...btnBase, textDecoration: 'none' }}>Edit</Link>
                      <button onClick={() => setDeleteId(event.id)} style={{ ...btnBase, color: '#C8102E', borderColor: '#F0D0D0' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(deleteId)} style={{ background: '#C8102E', color: '#FFFFFF' }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}