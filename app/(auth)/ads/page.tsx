'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface Ad {
  id: string;
  title: string;
  type: string;
  vastUrl: string;
  active: boolean;
  createdAt: string;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      fetchAds();
    } catch (error) {
      console.error('Failed to update ad:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      fetchAds();
    } catch (error) {
      console.error('Failed to delete ad:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VAST Ads</h1>
          <p className="text-gray-600">Manage pre-roll and mid-roll advertisements</p>
        </div>
        <Button variant="secondary"  onClick={() => router.push('/ads/new')}>Add New Ad</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : ads.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No ads configured yet.</p>
        </div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">VAST URL</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{ad.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-primary-light text-primary-dark text-xs rounded">
                      {ad.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">
                    {ad.vastUrl}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(ad.id, ad.active)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        ad.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ad.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(ad.id)}
                      className="text-xs"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
