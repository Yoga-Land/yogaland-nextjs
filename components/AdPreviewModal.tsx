"use client";

import { useUIStore } from "@/store/uiStore";

export default function AdPreviewModal() {
  const { previewAd, setPreviewAd } = useUIStore();

  if (!previewAd) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => setPreviewAd(null)}
    >
      <div
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {previewAd.title}
          </h2>
          <button
            onClick={() => setPreviewAd(null)}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-sm sm:text-base text-gray-600 mb-3">
          <strong>Type:</strong> {previewAd.type}
        </p>

        <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden border">
          <iframe
            src={previewAd.vastUrl}
            title={previewAd.title}
            className="absolute top-0 left-0 w-full h-full"
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
