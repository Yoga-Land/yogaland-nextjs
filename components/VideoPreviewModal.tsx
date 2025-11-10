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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-2 sm:px-4"
      onClick={() => setPreviewVideo(null)}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-auto p-4 sm:p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
            {previewVideo.title}
          </h2>
          <button
            onClick={() => setPreviewVideo(null)}
            className="text-gray-500 hover:text-gray-700 text-3xl sm:text-2xl absolute sm:static top-2 right-4"
          >
            X
          </button>
        </div>
        {isYouTube(previewVideo.videoUrl) ? (
          <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden">
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
            className="w-full rounded-lg max-h-[70vh] object-contain"
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
