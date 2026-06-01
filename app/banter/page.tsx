"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

type Post = {
  id: string;
  player_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  players: { nickname: string; avatar_url: string | null } | null;
  post_likes: { player_id: string }[];
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function BanterPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*, players(nickname, avatar_url), post_likes(player_id)")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: player } = await supabase
          .from("players")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setCurrentPlayer(player ?? null);
      }
      await loadPosts();
      setLoading(false);
    };
    init();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("posts").upload(filename, file);
    if (!error) {
      const { data } = supabase.storage.from("posts").getPublicUrl(filename);
      setImageUrl(data.publicUrl);
    }
    setUploadingImage(false);
  };

  const [postError, setPostError] = useState<string | null>(null);

  const handlePost = async () => {
    if (!content.trim() || !currentPlayer) return;
    setPosting(true);
    setPostError(null);
    const { error } = await supabase.from("posts").insert({
      player_id: currentPlayer.id,
      content: content.trim(),
      image_url: imageUrl,
    });
    if (error) {
      setPostError("Post failed: " + error.message);
    } else {
      setContent("");
      setImageUrl(null);
      await loadPosts();
    }
    setPosting(false);
  };

  const toggleLike = async (post: Post) => {
    if (!currentPlayer) return;
    const isLiked = post.post_likes.some((l) => l.player_id === currentPlayer.id);
    if (isLiked) {
      await supabase.from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("player_id", currentPlayer.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: post.id,
        player_id: currentPlayer.id,
      });
    }
    await loadPosts();
  };

  const handleDelete = async (postId: string) => {
    await supabase.from("posts").delete().eq("id", postId);
    await loadPosts();
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-10 text-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">Banter</h1>
      <p className="text-gray-500 text-sm mb-8">The 19th hole. Any time, anywhere.</p>

      {/* Compose */}
      {currentPlayer ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-start gap-3">
            {currentPlayer.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentPlayer.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black flex-shrink-0">
                {currentPlayer.nickname[0]}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening on the fairway…"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              {imageUrl && (
                <div className="relative mt-2 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="" className="max-h-40 rounded-xl" />
                  <button
                    onClick={() => setImageUrl(null)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >✕</button>
                </div>
              )}
              {postError && (
                <div className="mt-2 text-red-600 text-xs bg-red-50 rounded-lg px-3 py-2">
                  ⚠️ {postError}
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => imageRef.current?.click()}
                  disabled={uploadingImage}
                  className="text-gray-400 hover:text-green-700 text-sm transition-colors"
                >
                  {uploadingImage ? "Uploading…" : "📷 Add photo"}
                </button>
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button
                  onClick={handlePost}
                  disabled={posting || !content.trim()}
                  className="bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors"
                >
                  {posting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
          ⚠️ Your account isn&apos;t linked to a player yet. Ask Grumpy to link it in Supabase.
        </div>
      )}

      {/* Posts feed */}
      {posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🏌️</div>
          <p>No banter yet. Be the first.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => {
          const isLiked = currentPlayer
            ? post.post_likes.some((l) => l.player_id === currentPlayer.id)
            : false;
          const isOwn = currentPlayer?.id === post.player_id;

          return (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {post.players?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.players.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black flex-shrink-0">
                    {post.players?.nickname?.[0] ?? "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-green-900 text-sm">
                      {post.players?.nickname ?? "Unknown"}
                    </span>
                    <span className="text-gray-400 text-xs flex-shrink-0">
                      {timeAgo(post.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-800 text-sm mt-1 leading-relaxed">{post.content}</p>

                  {post.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image_url} alt="" className="mt-2 rounded-xl max-h-64 w-auto" />
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => toggleLike(post)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        isLiked ? "text-red-500 font-semibold" : "text-gray-400 hover:text-red-400"
                      }`}
                    >
                      {isLiked ? "❤️" : "🤍"} {post.post_likes.length}
                    </button>
                    {isOwn && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-xs text-gray-300 hover:text-red-400 transition-colors ml-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
