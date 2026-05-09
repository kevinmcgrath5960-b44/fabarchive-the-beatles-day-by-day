import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const inputStyle = { width: '100%', height: '36px', padding: '0 10px', fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' };

export default function AdminOverviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(1962);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [text, setText] = useState('');
  const [themes, setThemes] = useState('');

  const { data: overviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  useEffect(() => {
    const existing = overviews.find(o => o.year === selectedYear && o.month === selectedMonth);
    setText(existing?.overview_text || '');
    setThemes(existing?.key_themes || '');
  }, [selectedYear, selectedMonth, overviews]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const existing = overviews.find(o => o.year === selectedYear && o.month === selectedMonth);
      const payload = { year: selectedYear, month: selectedMonth, overview_text: text, key_themes: themes };
      if (existing) return base44.entities.MonthOverview.update(existing.id, payload);
      return base44.entities.MonthOverview.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-overviews'] });
      toast({ title: 'Overview saved' });
    },
  });

  const pillBtn = (active) => ({
    padding: '4px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '0',
    border: active ? '1px solid #111111' : '1px solid #CCCCCC',
    background: active ? '#111111' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#666666',
  });

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111', marginBottom: '24px' }}>Month Overviews</h1>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Year</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setSelectedYear(y)} style={pillBtn(selectedYear === y)}>{y}</button>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Month</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {MONTH_NAMES.map((m, i) => (
            <button key={i} onClick={() => setSelectedMonth(i + 1)} style={pillBtn(selectedMonth === i + 1)}>{m.slice(0, 3)}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '640px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 500, color: '#111111', marginBottom: '16px' }}>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</h2>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Overview Text (Markdown)</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8} style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} placeholder="What happened this month..." />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Key Themes</label>
          <input value={themes} onChange={e => setThemes(e.target.value)} style={inputStyle} placeholder="e.g. Abbey Road sessions, touring" />
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
          {saveMutation.isPending ? 'Saving…' : 'Save Overview'}
        </button>
      </div>
    </div>
  );
}