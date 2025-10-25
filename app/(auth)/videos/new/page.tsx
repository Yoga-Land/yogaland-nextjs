"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    duration: 0,
    views: 0,
    active: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create video");
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
        Add New Video
      </h1>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <FormInput
            label="Thumbnail URL"
            type="url"
            value={formData.thumbnail}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            required
          />

          <FormInput
            label="Video URL"
            type="url"
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData({ ...formData, videoUrl: e.target.value })
            }
            required
          />

          <FormInput
            label="Duration (seconds)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: +e.target.value })
            }
            required
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            <span>Set as active</span>
          </label>

          {error && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded-md">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-amber-500 text-white font-semibold hover:bg-amber-600"
            >
              {loading ? "Creating..." : "Create Video"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/videos")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
