"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Photo = { name: string; url: string };

// All tour years, newest first
const TOUR_YEARS = Array.from({ length: 21 }, (_, i) => 2026 - i);

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "all">(2026);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("gallery")
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      setError("Could not load photos: " + error.message);
      setLoading(false);
      return;
    }

    const files = (data ?? []).filter(
      (f) => f.name !== ".emptyFolderPlaceholder" && f.name !== ""
    );

    const withUrls: Photo[] = files.map((f) => {
      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(f.name);
      return { name: f.name, url: urlData.publicUrl };
    });

    setPhotos(withUrls);
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Filter photos by selected year (year prefix in filename e.g. "2026_...")
  const filteredPhotos =
    selectedYear === "all"
      ? photos
      : photos.filter((p) => p.name.startsWith(`${selectedYear}_`));

  // Count photos per year for the tab badges
  const countForYear = (year: number) =>
    photos.filter((p) => p.name.startsWith(`${year}_`)).length;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    const year = selectedYear === "all" ? 2026 : selectedYear;
    const errors: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop();
        const filename = `${year}_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("gallery")
          .upload(filename, file);
        if (error) errors.push(`${file.name}: ${error.message}`);
      })
    );

    if (errors.length > 0) setError("Some uploads failed: " + errors.join(", "));

    await loadPhotos();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-green-900">Gallery</h1>
        <div className="flex gap-2">
          <button
            onClick={loadPhotos}
            className="border border-gray-200 text-gray-500 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-gray-50"
          >
            ↻
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {uploading ? "Uploading…" : "📸 Upload"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Year tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedYear("all")}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            selectedYear === "all"
              ? "bg-green-800 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-green-400"
          }`}
        >
          All ({photos.length})
        </button>
        {TOUR_YEARS.map((year) => {
          const count = countForYear(year);
          return (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedYear === year
                  ? "bg-green-800 text-white"
                  : count > 0
                  ? "bg-amber-50 border border-amber-300 text-amber-800 hover:border-amber-500"
                  : "bg-white border border-gray-200 text-gray-400 hover:border-green-400"
              }`}
            >
              {year} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading photos…</div>
      )}

      {!loading && filteredPhotos.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">
            No photos for {selectedYear === "all" ? "any year" : selectedYear}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {selectedYear !== "all"
              ? `Select ${selectedYear} in the tabs then hit Upload.`
              : "Hit the Upload button to add the first ones."}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-800 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            📸 Upload Photos
          </button>
        </div>
      )}

      {filteredPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.name}
              onClick={() => setSelected(photo)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt="DAM Tour photo"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.url}
              alt="DAM Tour photo"
              className="rounded-2xl w-full h-auto object-contain max-h-[80vh]"
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
