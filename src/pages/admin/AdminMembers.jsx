import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const inputStyle = { width: '100%', height: '36px', padding: '0 10px', fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' };

const DEFAULT_MEMBERS = [
  { name: 'John Lennon', role: 'Rhythm Guitar, Vocals', years_with_beatles: '1960–1970', colour_code: '#C8102E' },
  { name: 'Paul McCartney', role: 'Bass, Vocals', years_with_beatles: '1960–1970', colour_code: '#111111' },
  { name: 'George Harrison', role: 'Lead Guitar, Vocals', years_with_beatles: '1958–1970', colour_code: '#111111' },
  { name: 'Ringo Starr', role: 'Drums, Vocals', years_with_beatles: '1962–1970', colour_code: '#111111' },
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
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111', marginBottom: '24px' }}>Members</h1>

      {members.length === 0 && (
        <div style={{ border: '1px dashed #CCCCCC', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#999999', marginBottom: '12px' }}>No members yet.</p>
          <button onClick={() => initMutation.mutate()} style={{ padding: '8px 16px', fontSize: '13px', background: '#111111', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
            Create Default Members
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ width: '180px', flexShrink: 0 }}>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
                fontSize: '13px', background: 'none', cursor: 'pointer',
                border: 'none',
                borderLeft: selected === m.id ? '3px solid #C8102E' : '3px solid transparent',
                color: selected === m.id ? '#111111' : '#666666',
                fontWeight: selected === m.id ? 500 : 400,
              }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {selected && (
          <div style={{ flex: 1, maxWidth: '480px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div><label style={labelStyle}>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Role</label><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Years</label><input value={form.years_with_beatles} onChange={e => setForm({ ...form, years_with_beatles: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={5} style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Profile Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '12px', marginBottom: '6px' }} />
              {form.photo_url && <img src={form.photo_url} alt="" style={{ height: '80px', objectFit: 'cover', border: '1px solid #E5E5E5' }} />}
            </div>
            <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
              {saveMutation.isPending ? 'Saving…' : 'Save Member'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}