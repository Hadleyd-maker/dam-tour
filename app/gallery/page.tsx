export default function GalleryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">Gallery</h1>
      <p className="text-gray-500 text-sm mb-8">Photos from the fairways, the rough, and the 19th hole.</p>

      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h2 className="text-xl font-bold text-gray-600 mb-2">Photos coming soon</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Once we connect Supabase storage, you&apos;ll be able to upload and browse
          photos from every DAM Tour event.
        </p>
      </div>
    </div>
  );
}
