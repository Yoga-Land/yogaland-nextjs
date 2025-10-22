'use client';

import { useUIStore } from '@/store/uiStore';
import { useEffect, useRef } from 'react';

export default function VideoPreviewModal() {
  const { previewVideo, setPreviewVideo } = useUIStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (previewVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [previewVideo]);

  if (!previewVideo) return null;

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
        <video
          ref={videoRef}
          controls
          className="w-full rounded-lg"
          poster={previewVideo.thumbnail}
        >
          <source src={previewVideo.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
