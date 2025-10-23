"use client";

import { useUIStore } from "@/store/uiStore";
import Button from "./Button";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description?: string;
    thumbnail: string;
    videoUrl: string;
    duration: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  const setPreviewVideo = useUIStore((state) => state.setPreviewVideo);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      {/* Thumbnail Container */}
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Preview Button (shown on hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-100 opacity-0 group-hover:opacity-80 transition-opacity">
          <Button
            onClick={() => setPreviewVideo(video)}
            className="text-white px-4 py-2 bg-amber-500"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {video.description}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Duration: {formatDuration(video.duration)}
        </p>

        {/* Edit & Delete Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex-1 text-sm"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            className="flex-1 text-sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
