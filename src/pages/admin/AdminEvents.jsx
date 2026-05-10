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

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const btnBase = {
  fontSize: '12px', padding: '4px 10px', border: '1px solid #E5E5E5',
  background: '#FFFFFF', color: '#444444', cursor: 'pointer', borderRadius: '0',
};

const pillBtn = (active) => ({
  padding: '4px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '0',
  border: active ? '1px solid #111111' : '1px solid #CCCCCC',
  background: active ? '#111111' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#666666',
});

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
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

  const handleYearClick = (y) => {
    if (filterYear === y) { setFilterYear(null); setFilterMonth(null); }
    else { setFilterYear(y); setFilterMonth(null); }
  };

  const handleMonthClick = (m) => {
    setFilterMonth(filterMonth === m ? null : m);
  };

  const filtered = events.filter(e => {
    if (search && !(e.title || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (filterYear) {
      const d = e.date ? new Date(e.date) : null;
      if (!d || d.getFullYear() !== filterYear) return false;
    }
    if (filterMonth !== null) {
      const d = e.date ? new Date(e.date) : null;
      if (!d || d.getMonth() !== filterMonth) return false;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111' }}>Events</h1>
        <Link to="/admin/events/new" style={{
          display: 'inline-block', padding: '8px 16px', fontSize: '13px', fontWeight: 500,
          background: '#C8102E', color: '#FFFFFF', textDecoration: 'none', borderRadius: '0',
        }}>
          + New Event
        </Link>
      </div>

      {/* ── Filter panel ─────────────────────────────────────────────────────── */}
      <div style={{
        background: '#F7F7F7', border: '1px solid #E5E5E5',
        padding: '16px 20px', marginBottom: '20px',
      }}>
        {/* Year row */}
        <div style={{ marginBottom: filterYear ? '12px' : '0' }}>
          <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Year
            {filterYear && (
              <button
                onClick={() => { setFilterYear(null); setFilterMonth(null); }}
                style={{ marginLeft: '10px', fontSize: '10px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                × Clear
              </button>
            )}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => handleYearClick(y)} style={pillBtn(filterYear === y)}>{y}</button>
            ))}
          </div>
        </div>

        {/* Month row — only visible when a year is selected */}
        {filterYear && (
          <div>
            <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Month
              {filterMonth !== null && (
                <button
                  onClick={() => setFilterMonth(null)}
                  style={{ marginLeft: '10px', fontSize: '10px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  × Clear
                </button>
              )}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {MONTH_NAMES.map((m, i) => (
                <button key={i} onClick={() => handleMonthClick(i)} style={pillBtn(filterMonth === i)}>{m}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Search + count ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search events by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '300px', height: '36px', padding: '0 12px',
            fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        <p style={{ fontSize: '12px', color: '#999999' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          {(filterYear || filterMonth !== null || search) && (
            <button
              onClick={() => { setFilterYear(null); setFilterMonth(null); setSearch(''); }}
              style={{ marginLeft: '8px', fontSize: '11px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              × Clear all filters
            </button>
          )}
        </p>
      </div>

      {isLoading ? (
        <div>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: '40px', background: '#F5F5F5', marginBottom: '1px' }} />)}</div>
      ) : (
        <div style={{ border: '1px solid #E5E5E5' }}>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F7F7F7', borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, fontSize: '11px', color: '#999999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '9px 12px', width: '80px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => (
                <tr key={event.id} style={{ borderBottom: '1px solid #F0F0F0', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                  <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#C8102E', whiteSpace: 'nowrap' }}>
                    {event.date ? format(new Date(event.date), 'dd MMM yyyy') : '—'}
                  </td>
                  <td style={{ padding: '9px 12px', color: '#111111', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {event.is_milestone && <span style={{ fontSize: '10px', color: '#C8102E', border: '1px solid rgba(200,16,46,0.3)', padding: '1px 5px', fontFamily: '"Inter", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>M</span>}
                      {event.is_featured && <span style={{ fontSize: '10px', color: '#C8102E' }}>★</span>}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 12px', fontSize: '12px', color: '#666666' }}>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '24px 12px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                    No events match the current filters.
                  </td>
                </tr>
              )}
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
