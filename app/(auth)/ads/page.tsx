"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useUIStore } from "@/store/uiStore";
import AdPreviewModal from "@/components/AdPreviewModal";

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
  const { setPreviewAd } = useUIStore();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to load ads.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      await fetch(`/api/ads/${id}`, { method: "DELETE" });
      toast.success("Ad deleted successfully!");
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error("Failed to delete ad.");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      toast.success(`Ad ${currentStatus ? "deactivated" : "activated"}!`);
      fetchAds();
    } catch (error) {
      console.error("Failed to update ad:", error);
      toast.error("Failed to update ad status.");
    }
  };

  return (
    <div className="h-full">
      <AdPreviewModal />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VAST Ads</h1>
          <p className="text-gray-600">
            Manage pre-roll and mid-roll advertisements
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/ads/new")}>
          Add New Ad
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-gray-900">{ad.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{ad.type}</p>
              <p className="text-xs text-gray-400 truncate">{ad.vastUrl}</p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setPreviewAd(ad)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Preview
                </button>

                <div className="flex gap-3">
                  <button
                    title="click to toggle status"
                    onClick={() => toggleActive(ad.id, ad.active)}
                    className={`text-sm px-2 py-1 rounded cursor-pointer ${
                      ad.active
                        ? "bg-green-100 text-green-700 "
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {ad.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => {
                      const adData = encodeURIComponent(JSON.stringify(ad));
                      router.push(`/ads/edit?data=${adData}`);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
