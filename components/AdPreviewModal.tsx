"use client";

import { useUIStore } from "@/store/uiStore";

export default function AdPreviewModal() {
  const { previewAd, setPreviewAd } = useUIStore();

  if (!previewAd) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={() => setPreviewAd(null)}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {previewAd.title}
          </h2>
          <button
            onClick={() => setPreviewAd(null)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-3">
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
