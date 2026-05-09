import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

const EVENT_TYPES = ['Recording Session', 'Live Performance', 'Business/Management', 'Apple Corps', 'Solo Work', 'Personal', 'Release', 'Media Appearance', 'Travel'];
const ALL_MEMBERS = ['John Lennon', 'Paul McCartney', 'George Harrison', 'Ringo Starr', 'Pete Best', 'Stuart Sutcliffe'];

export default function AdminEventForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pathParts = window.location.pathname.split('/');
  const eventId = pathParts[pathParts.length - 1];
  const isNew = eventId === 'new';

  const [form, setForm] = useState({
    date: '', approximate_date: false, approximate_description: '', title: '', body: '',
    event_type: '', members: [], is_featured: false, tags: '', sources: '', photos: [],
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
      });
    }
  }, [existingEvent]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (isNew) {
        return base44.entities.Event.create(payload);
      }
      return base44.entities.Event.update(existingEvent.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-all'] });
      toast({ title: isNew ? 'Event created' : 'Event updated' });
      navigate('/admin');
    },
  });

  const handleMemberToggle = (memberName) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(memberName)
        ? prev.members.filter(m => m !== memberName)
        : [...prev.members, memberName],
    }));
  };

  const addPhoto = () => {
    setForm(prev => ({ ...prev, photos: [...prev.photos, { url: '', caption: '', credit: '' }] }));
  };

  const updatePhoto = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.map((p, i) => i === idx ? { ...p, [field]: value } : p),
    }));
  };

  const removePhoto = (idx) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
  };

  const handleFileUpload = async (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    updatePhoto(idx, 'url', file_url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="gap-1 mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      <h1 className="text-2xl font-serif font-bold mb-6">{isNew ? 'New Event' : 'Edit Event'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={form.event_type || ''} onValueChange={v => setForm({ ...form, event_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.approximate_date} onCheckedChange={v => setForm({ ...form, approximate_date: v })} />
            <Label className="text-sm">Approximate date</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_featured} onCheckedChange={v => setForm({ ...form, is_featured: v })} />
            <Label className="text-sm">Featured</Label>
          </div>
        </div>

        {form.approximate_date && (
          <div className="space-y-2">
            <Label>Approximate Description</Label>
            <Input
              value={form.approximate_description || ''}
              onChange={e => setForm({ ...form, approximate_description: e.target.value })}
              placeholder="e.g. Early January 1962"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Event headline" />
        </div>

        <div className="space-y-2">
          <Label>Body (Markdown)</Label>
          <Textarea
            value={form.body || ''}
            onChange={e => setForm({ ...form, body: e.target.value })}
            rows={10}
            placeholder="Full event description..."
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Members Involved</Label>
          <div className="flex flex-wrap gap-3">
            {ALL_MEMBERS.map(m => (
              <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.members.includes(m)} onCheckedChange={() => handleMemberToggle(m)} />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            value={form.tags || ''}
            onChange={e => setForm({ ...form, tags: e.target.value })}
            placeholder="abbey road, recording, album"
          />
        </div>

        <div className="space-y-2">
          <Label>Sources</Label>
          <Textarea
            value={form.sources || ''}
            onChange={e => setForm({ ...form, sources: e.target.value })}
            rows={3}
            placeholder="References and sources..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Photos</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPhoto} className="gap-1">
              <Plus className="w-3 h-3" /> Add Photo
            </Button>
          </div>
          {form.photos.map((photo, idx) => (
            <div key={idx} className="border border-border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Photo {idx + 1}</span>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePhoto(idx)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(idx, e)} className="text-xs" />
              {photo.url && <img src={photo.url} alt="" className="h-20 object-cover rounded" />}
              <Input value={photo.url || ''} onChange={e => updatePhoto(idx, 'url', e.target.value)} placeholder="Or paste URL" className="text-xs" />
              <Input value={photo.caption || ''} onChange={e => updatePhoto(idx, 'caption', e.target.value)} placeholder="Caption" className="text-xs" />
              <Input value={photo.credit || ''} onChange={e => updatePhoto(idx, 'credit', e.target.value)} placeholder="Credit" className="text-xs" />
            </div>
          ))}
        </div>

        <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
          <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Event'}
        </Button>
      </form>
    </div>
  );
}