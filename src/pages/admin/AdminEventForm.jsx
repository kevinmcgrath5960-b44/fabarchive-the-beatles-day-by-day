import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

const EVENT_TYPES = ['Recording Session', 'Live Performance', 'Business/Management', 'Apple Corps', 'Solo Work', 'Personal', 'Release', 'Media Appearance', 'Travel'];
const ALL_MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr', 'Pete Best', 'Stuart Sutcliffe'];

const inputStyle = {
  width: '100%', height: '36px', padding: '0 10px', fontSize: '13px',
  border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none',
  color: '#111111', borderRadius: '0', boxSizing: 'border-box',
};
const labelStyle = { fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' };
const fieldStyle = { marginBottom: '16px' };
const checkboxLabel = { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#444444', cursor: 'pointer' };

export default function AdminEventForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/admin';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathParts = window.location.pathname.split('/');
  const eventId = pathParts[pathParts.length - 1];
  const isNew = eventId === 'new';

  const [form, setForm] = useState({
    date: '', approximate_date: false, approximate_description: '',
    title: '', body: '', event_type: '', location: '',
    members: [], is_featured: false, is_milestone: false,
    tags: '', sources: '', photos: [],
  });

  const { data: existingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const events = await base44.entities.Event.list('-date', 2000);
      return events.find(e => String(e.id) === eventId);
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existingEvent) {
      setForm({
        ...existingEvent,
        tags: (existingEvent.tags || []).join(', '),
        photos: existingEvent.photos || [],
        members: existingEvent.members || [],
        is_milestone: existingEvent.is_milestone || false,
      });
    }
  }, [existingEvent]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (isNew) return base44.entities.Event.create(payload);
      return base44.entities.Event.update(existingEvent.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-all'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      toast({ title: isNew ? 'Event created' : 'Event updated' });
      navigate(returnTo);
    },
  });

  const handleMemberToggle = (m) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(m) ? prev.members.filter(x => x !== m) : [...prev.members, m],
    }));
  };

  const addPhoto = () => setForm(prev => ({ ...prev, photos: [...prev.photos, { url: '', caption: '', credit: '', size: 'full' }] }));
  const updatePhoto = (idx, field, value) => setForm(prev => ({ ...prev, photos: prev.photos.map((p, i) => i === idx ? { ...p, [field]: value } : p) }));
  const removePhoto = (idx) => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));

  const handleFileUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    updatePhoto(idx, 'url', file_url);
  };

  return (
    <div>
      <button
        onClick={() => navigate(returnTo)}
        style={{ fontSize: '12px', color: '#666666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
      >
        ← Back
      </button>
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111', marginBottom: '28px' }}>
        {isNew ? 'New Event' : 'Edit Event'}
      </h1>

      <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form); }}>

        {/* ── Two-column layout: metadata left, body right ─────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', alignItems: 'flex-start' }}>

          {/* ── LEFT: Metadata ──────────────────────────────────────────────── */}
          <div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Event Type</label>
                <select value={form.event_type || ''} onChange={e => setForm({ ...form, event_type: e.target.value })} style={inputStyle}>
                  <option value="">Select type</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <label style={checkboxLabel}>
                <input type="checkbox" checked={form.approximate_date} onChange={e => setForm({ ...form, approximate_date: e.target.checked })} />
                Approximate date
              </label>
              <label style={checkboxLabel}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                Featured (homepage)
              </label>
              <label style={checkboxLabel}>
                <input type="checkbox" checked={form.is_milestone} onChange={e => setForm({ ...form, is_milestone: e.target.checked })} />
                Milestone (lead entry)
              </label>
            </div>

            {form.approximate_date && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Approximate Description</label>
                <input value={form.approximate_description || ''} onChange={e => setForm({ ...form, approximate_description: e.target.value })} style={inputStyle} placeholder="e.g. Early January 1962" />
              </div>
            )}

            <div style={fieldStyle}>
              <label style={labelStyle}>Location</label>
              <input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} placeholder="e.g. Abbey Road Studios, London" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Members Involved</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ALL_MEMBERS.map(m => (
                  <label key={m} style={checkboxLabel}>
                    <input type="checkbox" checked={form.members.includes(m)} onChange={() => handleMemberToggle(m)} />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tags <span style={{ color: '#999', fontWeight: 400 }}>(comma-separated)</span></label>
              <input value={form.tags || ''} onChange={e => setForm({ ...form, tags: e.target.value })} style={inputStyle} placeholder="abbey road, recording, album" />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Sources</label>
              <textarea
                value={form.sources || ''}
                onChange={e => setForm({ ...form, sources: e.target.value })}
                rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical', fontSize: '12px' }}
                placeholder="References and sources..."
              />
            </div>

            {/* ── Photos ───────────────────────────────────────────────────── */}
            <div style={fieldStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={labelStyle}>Photos</label>
                <button type="button" onClick={addPhoto} style={{ fontSize: '12px', color: '#C8102E', background: 'none', border: '1px solid #E5E5E5', padding: '4px 10px', cursor: 'pointer' }}>
                  + Add Photo
                </button>
              </div>
              {form.photos.map((photo, idx) => (
                <div key={idx} style={{ border: '1px solid #E5E5E5', padding: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#999999' }}>Photo {idx + 1}</span>
                    <button type="button" onClick={() => removePhoto(idx)} style={{ fontSize: '11px', color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                  </div>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(idx, e)} style={{ fontSize: '12px', marginBottom: '6px' }} />
                  {photo.url && <img src={photo.url} alt="" style={{ height: '64px', objectFit: 'cover', marginBottom: '6px', display: 'block' }} />}
                  <input value={photo.url || ''} onChange={e => updatePhoto(idx, 'url', e.target.value)} style={{ ...inputStyle, marginBottom: '4px', fontSize: '12px' }} placeholder="Or paste image URL" />
                  <input value={photo.caption || ''} onChange={e => updatePhoto(idx, 'caption', e.target.value)} style={{ ...inputStyle, marginBottom: '4px', fontSize: '12px' }} placeholder="Caption" />
                  <input value={photo.credit || ''} onChange={e => updatePhoto(idx, 'credit', e.target.value)} style={{ ...inputStyle, marginBottom: '4px', fontSize: '12px' }} placeholder="Credit / Photographer" />
                  <div>
                    <label style={{ ...labelStyle, marginTop: '4px' }}>Display size</label>
                    <select value={photo.size || 'full'} onChange={e => updatePhoto(idx, 'size', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }}>
                      <option value="full">Full width</option>
                      <option value="half">Half width (centred)</option>
                      <option value="third">One third (centred)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer', width: '100%' }}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save Event'}
            </button>
          </div>

          {/* ── RIGHT: Title + Body editor ──────────────────────────────────── */}
          <div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Title</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ ...inputStyle, fontSize: '15px', fontWeight: 500, height: '42px' }}
                required
                placeholder="Event headline"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Body
                <span style={{ color: '#999', fontWeight: 400, marginLeft: '6px' }}>
                  — supports markdown · inline images: <code style={{ fontSize: '11px', background: '#f4f4f4', padding: '1px 5px' }}>![caption|right](url)</code>
                </span>
              </label>
              <MarkdownEditor
                value={form.body || ''}
                onChange={val => setForm({ ...form, body: val })}
                rows={28}
                placeholder="Full event description…"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
