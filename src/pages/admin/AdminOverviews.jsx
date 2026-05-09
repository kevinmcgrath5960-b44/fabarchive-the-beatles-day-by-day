import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

const YEARS = Array.from({ length: 10 }, (_, i) => 1962 + i);
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

  React.useEffect(() => {
    const existing = overviews.find(o => o.year === selectedYear && o.month === selectedMonth);
    setText(existing?.overview_text || '');
    setThemes(existing?.key_themes || '');
  }, [selectedYear, selectedMonth, overviews]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const existing = overviews.find(o => o.year === selectedYear && o.month === selectedMonth);
      const payload = { year: selectedYear, month: selectedMonth, overview_text: text, key_themes: themes };
      if (existing) {
        return base44.entities.MonthOverview.update(existing.id, payload);
      }
      return base44.entities.MonthOverview.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-overviews'] });
      toast({ title: 'Overview saved' });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Month Overviews</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-xs">Year</Label>
          <div className="flex flex-wrap gap-1">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2.5 py-1 text-xs font-mono rounded ${selectedYear === y ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Month</Label>
          <div className="flex flex-wrap gap-1">
            {MONTH_NAMES.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelectedMonth(i + 1)}
                className={`px-2.5 py-1 text-xs rounded ${selectedMonth === i + 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {m.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <h2 className="font-serif text-lg font-semibold">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</h2>
        <div className="space-y-2">
          <Label>Overview Text (Markdown)</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={8} className="font-mono text-sm" placeholder="What happened this month..." />
        </div>
        <div className="space-y-2">
          <Label>Key Themes</Label>
          <Input value={themes} onChange={e => setThemes(e.target.value)} placeholder="e.g. Abbey Road sessions, touring" />
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
          <Save className="w-4 h-4" /> Save Overview
        </Button>
      </div>
    </div>
  );
}