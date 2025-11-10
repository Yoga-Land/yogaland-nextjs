"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalAds: 0,
    activeAds: 0,
  });

  const [viewsOverTime, setViewsOverTime] = useState<any[]>([]);
  const [dailyViews, setDailyViews] = useState<any[]>([]);
  const [monthlyViews, setMonthlyViews] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<
    "total" | "daily" | "monthly"
  >("total");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
    fetchViews();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchViews = async () => {
    try {
      setLoading(true);

      const [resTotal, resDaily, resMonthly] = await Promise.all([
        fetch("api/videos?type=total"),
        fetch("api/videos?type=daily"),
        fetch("api/videos?type=monthly"),
      ]);

      if (!resTotal.ok || !resDaily.ok || !resMonthly.ok) {
        throw new Error("Failed to fetch views");
      }

      const totalVideos = await resTotal.json();
      const dailyData = await resDaily.json();
      const monthlyData = await resMonthly.json();
      const totalViews = totalVideos.reduce(
        (sum: number, v: any) => sum + (v.views || 0),
        0
      );

      setViewsOverTime([{ label: "Total Views", views: totalViews }]);
      setDailyViews(dailyData);
      setMonthlyViews(monthlyData);
    } catch (error) {
      console.error("Error fetching view data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentData =
    selectedView === "daily"
      ? dailyViews
      : selectedView === "monthly"
      ? monthlyViews
      : viewsOverTime;

  return (
    <div>
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome to YogaLand TV Admin Portal
        </p>
      </div>

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

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-8 mb-10">
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
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-9">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
            Views Over Time
          </h2>

          <div className="flex gap-2">
            {["total", "daily", "monthly"].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  selectedView === view
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {view === "total"
                  ? "Total Views"
                  : view === "daily"
                  ? "Daily Views"
                  : "Monthly Views"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading views...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  selectedView === "monthly"
                    ? "month"
                    : selectedView === "daily"
                    ? "date"
                    : "label"
                }
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [`${value} views`, "Views"]}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563eb"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
