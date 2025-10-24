"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function NewAdPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "Select Ad Type",
    vastUrl: "",
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
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create ad");
      }

      router.push("/ads");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-5 px-6">
      <h1 className="text-3xl font-bold text-[#1F2937] mb-2 text-center">
        Add New Ad
      </h1>

      <div className="bg-[#F9FAFB] p-8 rounded-xl shadow-lg border border-[#E5E7EB]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Ad Title"
            className="w-full p-2 border border-[#D1D5DB] rounded-lg  focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Type
            </label>
            <select
              className="input-field w-full p-2 border border-[#D1D5DB] rounded-lg focus:border-transparent transition-all"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            >
              <option value="Select Ad Type">Select ad type</option>
              <option value="pre-roll">Pre-Roll</option>
              <option value="mid-roll">Mid-Roll</option>
            </select>
          </div>

          <FormInput
            label="VAST URL"
            type="url"
            className="w-full p-2 border border-[#D1D5DB] rounded-lg focus:border-transparent transition-all"
            value={formData.vastUrl}
            onChange={(e) =>
              setFormData({ ...formData, vastUrl: e.target.value })
            }
            placeholder="https://example.com/vast.xml"
            required
          />

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Set as active
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#FF9100] text-amber-700 font-semibold hover:bg-[#E68200] transition-colors rounded-lg px-6 py-2"
            >
              {loading ? "Creating..." : "Create Ad"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/ads")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
