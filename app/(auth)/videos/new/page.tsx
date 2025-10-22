'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create video');
      }

      router.push('/videos');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-5 px-6">
      <h1 className="text-3xl font-bold text-[#1F2937] mb-2 text-center">Add New Video</h1>

      <div className="bg-[#F9FAFB] p-8 rounded-xl shadow-lg border border-[#E5E7EB]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Title"
            className="w-full p-3 border border-[#D1D5DB] rounded-lg  focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Description
            </label>
            <textarea
              className="w-full p-3 border border-[#D1D5DB] rounded-lg  focus:border-transparent transition-all resize-none"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <FormInput
            label="Thumbnail URL"
            className="w-full p-3 border border-[#D1D5DB] rounded-lg focus:border-transparent transition-all"
            type="url"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            required
          />

          <FormInput
            label="Video URL"
            type="url"
            className="w-full p-3 border border-[#D1D5DB] rounded-lg  focus:border-transparent transition-all"
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData({ ...formData, videoUrl: e.target.value })
            }
            required
          />

          <FormInput
            label="Duration (seconds)"
            type="number"
            className="w-full p-3 border border-[#D1D5DB] rounded-lg  focus:border-transparent transition-all"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
            required
          />

          {error && (
            <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FF9100] text-amber-700 font-semibold hover:bg-[#E68200] transition-colors rounded-lg px-6 py-2"
            >
              {loading ? 'Creating...' : 'Create Video'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/videos')}
              className="bg-[#E5E7EB] text-[#374151] font-semibold hover:bg-[#D1D5DB] transition-colors rounded-lg px-6 py-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
