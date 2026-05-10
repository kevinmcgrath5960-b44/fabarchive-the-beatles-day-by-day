import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

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

  const [tab, setTab] = useState('month'); // 'month' | 'year'
  const [selectedYear, setSelectedYear] = useState(1963);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [text, setText] = useState('');
  const [themes, setThemes] = useState('');

  // ── Month overviews ──────────────────────────────────────────────────────────
  const { data: monthOverviews = [] } = useQuery({
    queryKey: ['month-overviews'],
    queryFn: () => base44.entities.MonthOverview.list(),
  });

  // ── Year overviews ───────────────────────────────────────────────────────────
  const { data: yearOverviews = [] } = useQuery({
    queryKey: ['year-overviews'],
    queryFn: () => base44.entities.YearOverview.list(),
  });

  // Populate fields when selection or data changes
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

  // ── Save month ───────────────────────────────────────────────────────────────
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

  // ── Save year ────────────────────────────────────────────────────────────────
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
    ? `${selectedYear}`
    : `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div>
      {/* ── Tab switcher ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px', borderBottom: '1px solid #E5E5E5' }}>
        {['month', 'year'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 22px', fontSize: '13px', fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#111111' : '#999999',
              background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #C8102E' : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1px', textTransform: 'capitalize',
            }}
          >
            {t === 'month' ? 'Month Overviews' : 'Year Overviews'}
          </button>
        ))}
      </div>

      {/* ── Year picker (always shown) ────────────────────────────────────────── */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Year</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setSelectedYear(y)} style={pillBtn(selectedYear === y)}>{y}</button>
          ))}
        </div>
      </div>

      {/* ── Month picker (month tab only) ─────────────────────────────────────── */}
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

      {/* ── Editor ───────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '640px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 500, color: '#111111', marginBottom: '16px' }}>
          {currentLabel}
        </h2>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
            Overview Text (Markdown)
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={isYear ? 16 : 8}
            style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
            placeholder={isYear ? `What defined ${selectedYear} for the Beatles...` : 'What happened this month...'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' }}>
            Key Themes <span style={{ color: '#999', fontWeight: 400 }}>(comma-separated)</span>
          </label>
          <input
            value={themes}
            onChange={e => setThemes(e.target.value)}
            style={inputStyle}
            placeholder="e.g. Beatlemania, Please Please Me, Ed Sullivan"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
        >
          {isSaving ? 'Saving…' : `Save ${isYear ? 'Year' : 'Month'} Overview`}
        </button>
      </div>
    </div>
  );
}
