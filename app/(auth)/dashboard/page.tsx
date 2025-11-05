"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";

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
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div>
      {/* Ad Script */}
      <Script
        id="excitable-minor-ad"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(dihac){
              var d = document,
                  s = d.createElement('script'),
                  l = d.scripts[d.scripts.length - 1];
              s.settings = dihac || {};
              s.src = "//excitableminor.com/bmXUVUsyd.GVlK0jYtWJcH/Wexmj9Yu/ZWUSlHkKPjTjY/2UOjTLQd5rM_T/c/txN-jtYs5RNvDXkkxLObAa";
              s.async = true;
              s.referrerPolicy = 'no-referrer-when-downgrade';
              l.parentNode.insertBefore(s, l);
            })({})
          `,
        }}
      />

      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome to YogaLand TV Admin Portal
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Videos" value={stats.totalVideos} icon="🎥" />
        <StatCard title="Total Ads" value={stats.totalAds} icon="📺" />
        <StatCard
          title="Active Ads"
          value={stats.activeAds}
          icon="✅"
          color="green-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center md:text-left">
          Quick Actions
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
          <Button
            variant="secondary"
            onClick={() => router.push("/videos/new")}
            className="w-full sm:w-auto"
          >
            Add New Video
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/ads/new")}
            className="w-full sm:w-auto"
          >
            Add New Ad
          </Button>
        </div>
      </div>
    </div>
  );
}
