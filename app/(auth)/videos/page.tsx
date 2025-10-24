"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import Button from "@/components/Button";
import toast from "react-hot-toast";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await fetch(`/api/videos/${id}`, { method: "DELETE" });
      fetchVideos();
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast.error("Failed to delete video.");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });
      toast.success(`Ad ${currentStatus ? "deactivated" : "activated"}!`);
      console.log("Toggled active status", id, !currentStatus);
      fetchVideos();
    } catch (error) {
      console.error("Failed to update ad:", error);
      toast.error("Failed to update ad status.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Videos</h1>
          <p className="text-gray-600">Manage your yoga video content</p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/videos/new")}>
          Add New Video
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No videos yet. Add your first video!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              toggleActive={() => toggleActive(video.id, video.active)}
              onEdit={() => {
                const videoData = encodeURIComponent(JSON.stringify(video));
                router.push(`/videos/edit?data=${videoData}`);
              }}
              onDelete={() => handleDelete(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
