import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    site_title: 'The Beatles — Day by Day',
    tagline: 'An encyclopaedic historical archive',
    accent_colour: '#E24B4A',
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
        accent_colour: settings[0].accent_colour || '#E24B4A',
        on_this_day_enabled: settings[0].on_this_day_enabled !== false,
        hero_intro_text: settings[0].hero_intro_text || '',
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (settings.length > 0) {
        return base44.entities.SiteSettings.update(settings[0].id, form);
      }
      return base44.entities.SiteSettings.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved' });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Site Settings</h1>

      <div className="max-w-xl space-y-5">
        <div className="space-y-2">
          <Label>Site Title</Label>
          <Input value={form.site_title} onChange={e => setForm({ ...form, site_title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Accent Colour</Label>
          <div className="flex items-center gap-3">
            <Input type="color" value={form.accent_colour} onChange={e => setForm({ ...form, accent_colour: e.target.value })} className="w-16 h-10 p-1" />
            <Input value={form.accent_colour} onChange={e => setForm({ ...form, accent_colour: e.target.value })} className="w-28 font-mono text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.on_this_day_enabled} onCheckedChange={v => setForm({ ...form, on_this_day_enabled: v })} />
          <Label>"On This Day" Enabled</Label>
        </div>
        <div className="space-y-2">
          <Label>Hero Intro Text</Label>
          <Textarea value={form.hero_intro_text} onChange={e => setForm({ ...form, hero_intro_text: e.target.value })} rows={4} placeholder="Introduction text for the homepage..." />
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </Button>
      </div>
    </div>
  );
}