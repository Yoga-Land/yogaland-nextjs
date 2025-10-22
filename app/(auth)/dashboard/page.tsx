'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import Button from '@/components/Button';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalAds: 0,
    activeAds: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to YogaLand TV Admin Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Videos" value={stats.totalVideos} icon="🎥" />
        <StatCard title="Total Ads" value={stats.totalAds} icon="📺" />
        <StatCard title="Active Ads" value={stats.activeAds} icon="✅" color="green-500" />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex space-x-4">
          <Button variant="secondary" onClick={() => router.push('/videos/new')}>
            Add New Video
          </Button>
          <Button variant="secondary" onClick={() => router.push('/ads/new')}>
            Add New Ad
          </Button>
        </div>
      </div>
    </div>
  );
}
