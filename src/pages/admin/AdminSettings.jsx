import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const inputStyle = { width: '100%', height: '36px', padding: '0 10px', fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '12px', color: '#444444', fontWeight: 500, display: 'block', marginBottom: '5px' };
const fieldStyle = { marginBottom: '16px' };

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    site_title: 'The Beatles — Day by Day',
    tagline: 'An encyclopaedic historical archive, 1962–1971',
    accent_colour: '#C8102E',
    on_this_day_enabled: true,
    hero_intro_text: '',
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) {
      setForm({
        site_title: settings[0].site_title || '',
        tagline: settings[0].tagline || '',
        accent_colour: settings[0].accent_colour || '#C8102E',
        on_this_day_enabled: settings[0].on_this_day_enabled !== false,
        hero_intro_text: settings[0].hero_intro_text || '',
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (settings.length > 0) return base44.entities.SiteSettings.update(settings[0].id, form);
      return base44.entities.SiteSettings.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved' });
    },
  });

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111', marginBottom: '28px' }}>Site Settings</h1>

      <div style={{ maxWidth: '480px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Site Title</label>
          <input value={form.site_title} onChange={e => setForm({ ...form, site_title: e.target.value })} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Tagline</label>
          <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Accent Colour</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="color" value={form.accent_colour} onChange={e => setForm({ ...form, accent_colour: e.target.value })} style={{ width: '52px', height: '36px', padding: '2px', border: '1px solid #CCCCCC', cursor: 'pointer' }} />
            <input value={form.accent_colour} onChange={e => setForm({ ...form, accent_colour: e.target.value })} style={{ ...inputStyle, width: '120px', fontFamily: 'monospace' }} />
          </div>
        </div>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="otd" checked={form.on_this_day_enabled} onChange={e => setForm({ ...form, on_this_day_enabled: e.target.checked })} />
          <label htmlFor="otd" style={{ fontSize: '13px', color: '#444444', cursor: 'pointer' }}>"On This Day" Enabled</label>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Hero Intro Text</label>
          <textarea value={form.hero_intro_text} onChange={e => setForm({ ...form, hero_intro_text: e.target.value })} rows={4} style={{ ...inputStyle, height: 'auto', padding: '8px 10px', resize: 'vertical' }} placeholder="Introduction text for the homepage..." />
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} style={{ padding: '9px 20px', fontSize: '13px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
          {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}