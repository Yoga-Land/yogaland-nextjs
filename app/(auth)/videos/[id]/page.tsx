"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function EditVideoPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const router = useRouter();

  type Video = {
    id?: string;
    title: string;
    description?: string;
    thumbnail: string;
    videoUrl: string;
    duration?: number;
    active?: boolean;
  };

  const [formData, setFormData] = useState<Video>({
    id: "",
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    duration: 0,
    active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setFormData(parsed);
      } catch {
        setError("Invalid video data");
      }
    }
  }, [dataParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to edit video");
      }
      router.push("/videos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
        Edit Video
      </h1>
      <div className="bg-white p-5 sm:p-7 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <FormInput
            label="Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all resize-none"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <FormInput
            label="Thumbnail URL"
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            required
          />
          <FormInput
            label="Video URL"
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all"
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData({ ...formData, videoUrl: e.target.value })
            }
            required
          />
          <FormInput
            label="Duration (seconds)"
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-transparent transition-all"
            value={formData.duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: parseInt(e.target.value) || 0,
              })
            }
            required
          />
          <div>
            <label className="flex items-center gap-2 text-sm sm:text-base">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-gray-700">Set as active</span>
            </label>
          </div>
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors rounded-lg px-6 py-2 text-sm sm:text-base"
            >
              {loading ? "Saving..." : "Save Video"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/videos")}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors rounded-lg px-6 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
