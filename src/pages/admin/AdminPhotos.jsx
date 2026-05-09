import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminPhotos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ url: '', title: '', caption: '', credit: '', tags: '' });

  const { data: photos = [] } = useQuery({
    queryKey: ['photos'],
    queryFn: () => base44.entities.Photo.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Photo.create({
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      setOpen(false);
      setForm({ url: '', title: '', caption: '', credit: '', tags: '' });
      toast({ title: 'Photo added' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Photo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({ title: 'Photo deleted' });
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, url: file_url }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">Photo Library</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Upload Photo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Photo</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Upload File</Label>
                <Input type="file" accept="image/*" onChange={handleFileUpload} />
              </div>
              {form.url && <img src={form.url} alt="" className="h-32 object-cover rounded" />}
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Caption</Label><Input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} /></div>
              <div className="space-y-2"><Label>Credit</Label><Input value={form.credit} onChange={e => setForm({ ...form, credit: e.target.value })} /></div>
              <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
              <Button onClick={() => createMutation.mutate(form)} disabled={!form.url || createMutation.isPending}>Save Photo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="group relative border border-border rounded overflow-hidden">
            <img src={photo.url} alt={photo.title || ''} className="aspect-square object-cover w-full" />
            <div className="p-2">
              <p className="text-xs font-medium line-clamp-1">{photo.title || 'Untitled'}</p>
              {photo.credit && <p className="text-xs text-muted-foreground">{photo.credit}</p>}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteMutation.mutate(photo.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <p className="text-center py-12 text-muted-foreground text-sm">No photos yet. Upload your first one.</p>
      )}
    </div>
  );
}