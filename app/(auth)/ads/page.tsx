"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import { useUIStore } from "@/store/uiStore";
import AdPreviewModal from "@/components/AdPreviewModal";
import ConfirmModal from "@/components/ConfirmModal";

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
  const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null); // track video to delete

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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/ads/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Ad deleted successfully!");
      fetchAds();
    } catch (error) {
      toast.error("Failed to delete ad.");
    } finally {
      setDeleteTarget(null);
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 text-center sm:text-left ">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            VAST Ads
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage pre-roll and mid-roll advertisements
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push("/ads/new")}
          className="w-full sm:w-auto"
        >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {ad.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-1">
                  {ad.type}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {ad.vastUrl}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-3">
                <button
                  onClick={() => setPreviewAd(ad)}
                  className="text-blue-600 hover:underline text-sm sm:text-base cursor-pointer"
                >
                  Preview
                </button>

                <div className="flex flex-wrap gap-2">
                  <button
                    title="Click to toggle status"
                    onClick={() => toggleActive(ad.id, ad.active)}
                    className={`text-sm sm:text-base px-2 py-1 rounded cursor-pointer ${
                      ad.active
                        ? "bg-green-100 text-green-700"
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
                    className="text-sm sm:text-base text-blue-600 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(ad)}
                    className="text-sm sm:text-base text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Ad"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
