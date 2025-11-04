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
    views: number;
    active: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
  toggleActive: () => void;
}

export default function VideoCard({
  video,
  onEdit,
  onDelete,
  toggleActive,
}: VideoCardProps) {
  const setPreviewVideo = useUIStore((state) => state.setPreviewVideo);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-44 sm:h-52 md:h-60 object-cover rounded-t-xl"
        />
        {/* Preview Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 bg-opacity-10 opacity-0 group-hover:opacity-90 transition-opacity">
          <Button
            onClick={() => setPreviewVideo(video)}
            className="bg-amber-500 text-white text-sm sm:text-base px-4 py-2"
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Info - Flex grow to push buttons to bottom */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1">
          {video.description || "No description"}
        </p>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700">
          <span>Duration: {formatDuration(video.duration)}</span>
          <button
            onClick={toggleActive}
            title="Toggle status"
            className={`px-2 py-1 rounded cursor-pointer ${
              video.active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {video.active ? "Active" : "Inactive"}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-1000">
          Views: {video.views}
        </p>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1"></div>

        {/* Edit and Delete buttons at the bottom */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex-1 text-sm sm:text-base"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            className="flex-1 text-sm sm:text-base"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
