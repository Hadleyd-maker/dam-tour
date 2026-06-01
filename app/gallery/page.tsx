"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Photo = {
  name: string;
  url: string;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    const { data, error } = await supabase.storage
      .from("gallery")
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.error("Error listing photos:", error.message);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);

    // Upload all selected files in parallel
    await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("gallery")
          .upload(filename, file);
        if (error) console.error("Upload error:", error.message);
      })
    );

    await loadPhotos();
    setUploading(false);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-black text-green-900">Gallery</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          {uploading ? "Uploading…" : "📸 Upload Photos"}
        </button>
        {/* multiple allows selecting several at once */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Photos from the fairways and the 19th hole.{" "}
        <span className="text-gray-400">({photos.length} photo{photos.length !== 1 ? "s" : ""})</span>
      </p>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-20 text-gray-400">Loading photos…</div>
      )}

      {/* Empty state */}
      {!loading && photos.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">No photos yet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Hit the Upload Photos button to add the first ones.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-800 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            📸 Upload Photos
          </button>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <button
              key={photo.name}
              onClick={() => setSelected(photo)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
            >
              <Image
                src={photo.url}
                alt="DAM Tour photo"
                width={300}
                height={300}
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
            <Image
              src={selected.url}
              alt="DAM Tour photo"
              width={900}
              height={700}
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
