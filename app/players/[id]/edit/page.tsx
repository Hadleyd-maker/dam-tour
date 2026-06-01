"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

const FIELDS: {
  key: keyof Player;
  label: string;
  emoji: string;
  section: string;
  type?: string;
  placeholder?: string;
}[] = [
  // Basic
  { key: "home_course", label: "Home course", emoji: "🏠", section: "Basic Info", placeholder: "e.g. Royal Johannesburg" },
  { key: "handicap", label: "Current handicap", emoji: "📊", section: "Basic Info", type: "number", placeholder: "e.g. 14.2" },
  { key: "on_tour_since", label: "On the DAM Tour since", emoji: "📅", section: "Basic Info", type: "number", placeholder: "e.g. 2006" },
  // Golf
  { key: "best_round", label: "Best ever round — where & what score?", emoji: "🏆", section: "Golf Q&A", placeholder: "e.g. Pebble Beach, 71 gross" },
  { key: "favourite_course", label: "Favourite course you've ever played", emoji: "⛳", section: "Golf Q&A", placeholder: "e.g. Augusta National (in my dreams)" },
  { key: "memorable_moment", label: "Most memorable DAM Tour moment", emoji: "🌟", section: "Golf Q&A", placeholder: "That eagle on 18 in 2019…" },
  { key: "strongest_part", label: "Strongest part of your game", emoji: "💪", section: "Golf Q&A", placeholder: "e.g. Long game, putting, course management" },
  { key: "biggest_weakness", label: "Biggest weakness", emoji: "😬", section: "Golf Q&A", placeholder: "Be honest..." },
  { key: "nickname_story", label: "How did you get your nickname?", emoji: "🤣", section: "Golf Q&A", placeholder: "The story behind the name…" },
  { key: "unknown_fact", label: "One thing the others don't know about you", emoji: "🎲", section: "Golf Q&A", placeholder: "Spill it." },
  // Funny
  { key: "best_excuse", label: "Most creative excuse for a bad shot", emoji: "😡", section: "The Funny Stuff", placeholder: "e.g. The sun was in my eyes, a bird flew past, my grip slipped..." },
  { key: "nineteenth_drink", label: "19th hole drink of choice", emoji: "🍺", section: "The Funny Stuff", placeholder: "e.g. Cold lager, G&T, water (liar)" },
  { key: "embarrassing_moment", label: "Most embarrassing moment on a golf course", emoji: "🤦", section: "The Funny Stuff", placeholder: "We've all had one. Own it." },
  { key: "self_rating", label: "Rate your game out of 10 — and what the others would rate you", emoji: "🏌️", section: "The Funny Stuff", placeholder: "e.g. I'd say 7, they'd say 4" },
  { key: "sandbagger", label: "Sandbagger or genuine handicap?", emoji: "💸", section: "The Funny Stuff", placeholder: "Be very honest." },
  { key: "putt_reaction", label: "What happens when you miss a short putt?", emoji: "🤬", section: "The Funny Stuff", placeholder: "Words, actions, or both?" },
  { key: "golf_club_type", label: "If you were a golf club, which one and why?", emoji: "🎭", section: "The Funny Stuff", placeholder: "e.g. A 3-iron — nobody knows how to use me either" },
  { key: "worst_partner", label: "Who do you least want as a playing partner and why?", emoji: "👀", section: "The Funny Stuff", placeholder: "Name names. This is a safe space." },
  { key: "winning_odds", label: "Realistic odds of ever winning the DAM Tour (%)", emoji: "🎯", section: "The Funny Stuff", placeholder: "e.g. 2%" },
  { key: "useless_club", label: "Club you always carry but never use well", emoji: "🧳", section: "The Funny Stuff", placeholder: "e.g. 5-iron, fairway wood, putter (ouch)" },
];

const SECTIONS = [...new Set(FIELDS.map((f) => f.section))];

export default function EditProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [player, setPlayer] = useState<Partial<Player>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setPlayer(data ?? {});
        setLoading(false);
      });
  }, [id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const filename = `${id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setError("Photo upload failed: " + uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filename);

    // Add cache-busting timestamp so new photo shows immediately
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    setPlayer((p) => ({ ...p, avatar_url: avatarUrl }));
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error } = await supabase
      .from("players")
      .update({
        home_course: player.home_course,
        handicap: player.handicap,
        on_tour_since: player.on_tour_since,
        best_round: player.best_round,
        favourite_course: player.favourite_course,
        memorable_moment: player.memorable_moment,
        strongest_part: player.strongest_part,
        biggest_weakness: player.biggest_weakness,
        nickname_story: player.nickname_story,
        unknown_fact: player.unknown_fact,
        best_excuse: player.best_excuse,
        nineteenth_drink: player.nineteenth_drink,
        embarrassing_moment: player.embarrassing_moment,
        self_rating: player.self_rating,
        sandbagger: player.sandbagger,
        putt_reaction: player.putt_reaction,
        golf_club_type: player.golf_club_type,
        worst_partner: player.worst_partner,
        winning_odds: player.winning_odds,
        useless_club: player.useless_club,
        avatar_url: player.avatar_url,
      })
      .eq("id", id);

    if (error) {
      setError("Save failed: " + error.message);
    } else {
      setSaved(true);
      setTimeout(() => router.push(`/players/${id}`), 1000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href={`/players/${id}`}
        className="text-sm text-green-700 hover:underline mb-6 inline-block"
      >
        ← Back to profile
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {/* Avatar */}
        <button
          onClick={() => avatarInputRef.current?.click()}
          disabled={uploadingAvatar}
          className="relative flex-shrink-0 group"
        >
          {player.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.avatar_url}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center text-green-800 font-black text-3xl">
              {player.nickname?.[0] ?? "?"}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">
              {uploadingAvatar ? "…" : "📷"}
            </span>
          </div>
        </button>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />

        <div>
          <div className="text-2xl font-black text-green-900">{player.nickname}</div>
          <div className="text-gray-500">{player.name}</div>
          <div className="text-xs text-gray-400 mt-1">
            Click the photo to upload a profile picture
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          ✅ Profile saved! Redirecting…
        </div>
      )}

      {/* Question sections */}
      {SECTIONS.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="text-lg font-black text-green-900 mb-4 pb-2 border-b border-gray-100">
            {section}
          </h2>
          <div className="flex flex-col gap-4">
            {FIELDS.filter((f) => f.section === section).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {field.emoji} {field.label}
                </label>
                {field.type === "number" ? (
                  <input
                    type="number"
                    value={
                      player[field.key] != null
                        ? String(player[field.key])
                        : ""
                    }
                    onChange={(e) =>
                      setPlayer((p) => ({
                        ...p,
                        [field.key]: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <textarea
                    value={(player[field.key] as string) ?? ""}
                    onChange={(e) =>
                      setPlayer((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-green-800 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-3 rounded-xl transition-colors text-lg"
      >
        {saving ? "Saving…" : "💾 Save Profile"}
      </button>
    </div>
  );
}
