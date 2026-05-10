import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const inputStyle = {
  width: '100%', height: '36px', padding: '0 10px', fontSize: '13px',
  border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
};

const pillBtn = (active) => ({
  padding: '4px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '0',
  border: active ? '1px solid #111111' : '1px solid #CCCCCC',
  background: active ? '#111111' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#666666',
});

export default function AdminOverviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState('month');
  const [selectedYear, setSelectedYear] = useState(1963);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [text, setText] = useState('');
  const [themes, setThemes] = useState('');

  const { data: monthOverviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  const { data: yearOverviews = [] } = useQuery({
    queryKey: ['year-overviews'],
    queryFn: () => base44.entities.YearOverview.list(),
  });

  useEffect(() => {
    if (tab === 'month') {
      const existing = monthOverviews.find(o => o.year === selectedYear && o.month === selectedMonth);
      setText(existing?.overview_text || '');
      setThemes(existing?.key_themes || '');
    } else {
      const existing = yearOverviews.find(o => o.year === selectedYear);
      setText(existing?.overview_text || '');
      setThemes(existing?.key_themes || '');
    }
  }, [tab, selectedYear, selectedMonth, monthOverviews, yearOverviews]);

  const saveMonthMutation = useMutation({
    mutationFn: async () => {
      const existing = monthOverviews.find(o => o.year === selectedYear && o.month === selectedMonth);
      const payload = { year: selectedYear, month: selectedMonth, overview_text: text, key_themes: themes };
      return existing
        ? base44.entities.MonthOverview.update(existing.id, payload)
        : base44.entities.MonthOverview.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-overviews'] });
      toast({ title: 'Month overview saved' });
    },
  });

  const saveYearMutation = useMutation({
    mutationFn: async () => {
      const existing = yearOverviews.find(o => o.year === selectedYear);
      const payload = { year: selectedYear, overview_text: text, key_themes: themes };
      return existing
        ? base44.entities.YearOverview.update(existing.id, payload)
        : base44.entities.YearOverview.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['year-overviews'] });
      toast({ title: 'Year overview saved' });
    },
  });

  const isYear = tab === 'year';
  const isSaving = isYear ? saveYearMutation.isPending : saveMonthMutation.isPending;
  const handleSave = () => isYear ? saveYearMutation.mutate() : saveMonthMutation.mutate();
  const currentLabel = isYear
    ? String(selectedYear)
    : `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div data-color-mode="light">

      {/* ── Tab switcher ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5', marginBottom: '24px' }}>
        {['month', 'year'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 22px', fontSize: '13px',
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#111111' : '#999999',
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #C8102E' : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1px',
            }}
          >
            {t === 'month' ? 'Month Overviews' : 'Year Overviews'}
          </button>
        ))}
      </div>

      {/* ── Two-column layout: controls left, editor right ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'flex-start' }}>

        {/* ── LEFT: Pickers + themes + save ───────────────────────────────────── */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Year</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {YEARS.map(y => (
                <button key={y} onClick={() => setSelectedYear(y)} style={pillBtn(selectedYear === y)}>{y}</button>
              ))}
            </div>
          </div>

          {!isYear && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Month</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {MONTH_NAMES.map((m, i) => (
                  <button key={i} onClick={() => setSelectedMonth(i + 1)} style={pillBtn(selectedMonth === i + 1)}>
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
              Key Themes <span style={{ color: '#999', fontWeight: 400 }}>(comma-separated)</span>
            </label>
            <input
              value={themes}
              onChange={e => setThemes(e.target.value)}
              style={inputStyle}
              placeholder="e.g. Beatlemania, Abbey Road, Ed Sullivan"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '9px 20px', fontSize: '13px', fontWeight: 500,
              background: '#C8102E', color: '#FFFFFF', border: 'none',
              cursor: 'pointer', width: '100%',
            }}
          >
            {isSaving ? 'Saving…' : `Save ${isYear ? 'Year' : 'Month'} Overview`}
          </button>

          {/* Hint */}
          <div style={{ marginTop: '20px', padding: '12px', background: '#F9F9F9', border: '1px solid #EEEEEE' }}>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.6, marginBottom: '6px', fontWeight: 600 }}>Markdown tips</p>
            <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.7, fontFamily: 'monospace' }}>
              ## Section heading<br />
              ### Sub-heading<br />
              **bold** · *italic*<br />
              {'> blockquote'}<br />
              ---  (divider)<br />
              ![caption|right](url)<br />
              ![caption|half](url)<br />
              ![caption|full](url)
            </p>
          </div>
        </div>

        {/* ── RIGHT: MDEditor ───────────────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#111', marginBottom: '10px' }}>
            {currentLabel}
          </p>
          <MDEditor
            value={text}
            onChange={val => setText(val || '')}
            height={680}
            preview="live"
          />
        </div>
      </div>
    </div>
  );
}
