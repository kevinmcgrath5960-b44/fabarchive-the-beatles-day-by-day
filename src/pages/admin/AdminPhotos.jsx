import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const inputStyle = { width: '100%', height: '34px', padding: '0 10px', fontSize: '13px', border: '1px solid #CCCCCC', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box' };

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#111111' }}>Photo Library</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
              + Upload Photo
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle style={{ fontSize: '16px', fontWeight: 600 }}>Add Photo</DialogTitle></DialogHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#444444', display: 'block', marginBottom: '5px' }}>Upload File</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '13px' }} />
              </div>
              {form.url && <img src={form.url} alt="" style={{ height: '120px', objectFit: 'cover' }} />}
              {[['title', 'Title'], ['caption', 'Caption'], ['credit', 'Credit'], ['tags', 'Tags (comma-separated)']].map(([key, label]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#444444', display: 'block', marginBottom: '5px' }}>{label}</label>
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <button
                onClick={() => createMutation.mutate(form)}
                disabled={!form.url || createMutation.isPending}
                style={{ padding: '8px 16px', fontSize: '13px', background: '#C8102E', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
              >
                Save Photo
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ border: '1px solid #E5E5E5', background: '#FFFFFF', position: 'relative' }}
            onMouseEnter={e => e.currentTarget.querySelector('.del-btn').style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.querySelector('.del-btn').style.opacity = '0'}
          >
            <img src={photo.url} alt={photo.title || ''} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.title || 'Untitled'}</p>
              {photo.credit && <p style={{ fontSize: '11px', color: '#999999' }}>{photo.credit}</p>}
            </div>
            <button
              className="del-btn"
              onClick={() => deleteMutation.mutate(photo.id)}
              style={{ position: 'absolute', top: '6px', right: '6px', opacity: 0, background: '#C8102E', color: '#FFFFFF', border: 'none', padding: '3px 7px', fontSize: '11px', cursor: 'pointer', transition: 'opacity 0.15s' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <p style={{ textAlign: 'center', padding: '60px 0', fontSize: '14px', color: '#999999' }}>No photos yet.</p>
      )}
    </div>
  );
}