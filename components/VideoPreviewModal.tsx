"use client";

import { useUIStore } from "@/store/uiStore";
import { useEffect, useRef } from "react";

export default function VideoPreviewModal() {
  const { previewVideo, setPreviewVideo } = useUIStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (previewVideo && video && !isYouTube(previewVideo.videoUrl)) {
      video.load();

      const handleCanPlay = () => {
        video
          .play()
          .then(() => console.log("Video playing"))
          .catch((err) => console.warn("Autoplay blocked:", err));
      };

      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.pause();
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [previewVideo]);

  if (!previewVideo) return null;

  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#?]*)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={() => setPreviewVideo(null)}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {previewVideo.title}
          </h2>
          <button
            onClick={() => setPreviewVideo(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {isYouTube(previewVideo.videoUrl) ? (
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={getYouTubeEmbedUrl(previewVideo.videoUrl)}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={previewVideo.title}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            className="w-full rounded-lg"
            poster={previewVideo.thumbnail}
          >
            <source src={previewVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
