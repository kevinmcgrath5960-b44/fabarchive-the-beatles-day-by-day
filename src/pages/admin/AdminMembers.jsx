import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Plus } from 'lucide-react';

const DEFAULT_MEMBERS = [
  { name: 'John Lennon', role: 'Rhythm Guitar, Vocals', years_with_beatles: '1960–1970', colour_code: '#E24B4A' },
  { name: 'Paul McCartney', role: 'Bass, Vocals', years_with_beatles: '1960–1970', colour_code: '#3B82F6' },
  { name: 'George Harrison', role: 'Lead Guitar, Vocals', years_with_beatles: '1958–1970', colour_code: '#F59E0B' },
  { name: 'Ringo Starr', role: 'Drums, Vocals', years_with_beatles: '1962–1970', colour_code: '#22C55E' },
];

export default function AdminMembers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', years_with_beatles: '', bio: '', photo_url: '', colour_code: '' });

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => base44.entities.Member.list(),
  });

  const initMutation = useMutation({
    mutationFn: () => base44.entities.Member.bulkCreate(DEFAULT_MEMBERS),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });

  useEffect(() => {
    if (selected) {
      const m = members.find(m => m.id === selected);
      if (m) setForm({ name: m.name || '', role: m.role || '', years_with_beatles: m.years_with_beatles || '', bio: m.bio || '', photo_url: m.photo_url || '', colour_code: m.colour_code || '' });
    }
  }, [selected, members]);

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.Member.update(selected, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({ title: 'Member updated' });
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, photo_url: file_url }));
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Members</h1>

      {members.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border rounded mb-6">
          <p className="text-muted-foreground text-sm mb-3">No members yet. Initialize default members?</p>
          <Button onClick={() => initMutation.mutate()} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Create Default Members
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-48 space-y-1">
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                selected === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex-1 max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
              <div className="space-y-2"><Label>Years</Label><Input value={form.years_with_beatles} onChange={e => setForm({ ...form, years_with_beatles: e.target.value })} /></div>
              <div className="space-y-2"><Label>Colour Code</Label><Input value={form.colour_code} onChange={e => setForm({ ...form, colour_code: e.target.value })} type="color" /></div>
            </div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={6} /></div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
              {form.photo_url && <img src={form.photo_url} alt="" className="h-24 rounded" />}
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}