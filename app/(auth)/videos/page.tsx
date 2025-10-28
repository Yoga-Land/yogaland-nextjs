"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import Button from "@/components/Button";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";
import { log } from "console";
import VideoPreviewModal from "@/components/VideoPreviewModal";

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  active: boolean;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null); // track video to delete

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      toast.error("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/videos/${deleteTarget.id}`, { method: "DELETE" });
      toast.success("Video deleted successfully!");
      fetchVideos();
    } catch {
      toast.error("Failed to delete video.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      toast.success(`Video ${currentStatus ? "deactivated" : "activated"}!`);
      fetchVideos();
    } catch {
      toast.error("Failed to update video status.");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <VideoPreviewModal />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 text-center sm:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Videos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your yoga video content
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push("/videos/new")}
          className="mt-4 sm:mt-0 w-full sm:w-auto"
        >
          Add New Video
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow-sm py-10 px-6">
          <p className="text-gray-600 text-sm sm:text-base">
            No videos yet. Add your first video!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              toggleActive={() => toggleActive(video.id, video.active)}
              onEdit={() => {
                const videoData = encodeURIComponent(JSON.stringify(video));
                router.push(`/videos/edit?data=${videoData}`);
              }}
              onDelete={() => setDeleteTarget(video)}
            />
          ))}
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Video"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
