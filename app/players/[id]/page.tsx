"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

const SECTIONS = [
  {
    title: "⛳ Golf Profile",
    fields: [
      { key: "home_course", label: "Home course", emoji: "🏠" },
      { key: "on_tour_since", label: "On the DAM Tour since", emoji: "📅" },
      { key: "best_round", label: "Best ever round", emoji: "🏆" },
      { key: "favourite_course", label: "Favourite course ever played", emoji: "⛳" },
      { key: "memorable_moment", label: "Most memorable DAM Tour moment", emoji: "🌟" },
      { key: "strongest_part", label: "Strongest part of my game", emoji: "💪" },
      { key: "biggest_weakness", label: "Biggest weakness", emoji: "😬" },
      { key: "nickname_story", label: "How I got my nickname", emoji: "🤣" },
      { key: "unknown_fact", label: "One thing the others don't know", emoji: "🎲" },
    ],
  },
  {
    title: "😄 The Funny Stuff",
    fields: [
      { key: "best_excuse", label: "Most creative excuse for a bad shot", emoji: "😡" },
      { key: "nineteenth_drink", label: "19th hole drink of choice", emoji: "🍺" },
      { key: "embarrassing_moment", label: "Most embarrassing moment on a course", emoji: "🤦" },
      { key: "self_rating", label: "My game out of 10 (vs what others would say)", emoji: "🏌️" },
      { key: "sandbagger", label: "Sandbagger or genuine handicap?", emoji: "💸" },
      { key: "putt_reaction", label: "What happens when I miss a short putt", emoji: "🤬" },
      { key: "golf_club_type", label: "If I were a golf club…", emoji: "🎭" },
      { key: "worst_partner", label: "Least wanted playing partner (and why)", emoji: "👀" },
      { key: "winning_odds", label: "Realistic odds of winning the DAM Tour", emoji: "🎯" },
      { key: "useless_club", label: "Club I carry but never use well", emoji: "🧳" },
    ],
  },
];

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();
      setPlayer(data);
      setIsOwner(!!user && !!data && data.user_id === user.id);
      setLoading(false);
    };
    init();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center text-gray-400">
        Player not found.
      </div>
    );
  }

  const answered = (key: string) => {
    const val = player[key as keyof Player];
    return val !== null && val !== undefined && val !== "";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/players"
        className="text-sm text-green-700 hover:underline mb-6 inline-block"
      >
        ← All Players
      </Link>

      {/* Hero card */}
      <div className="bg-green-900 rounded-2xl p-6 flex items-center gap-6 mb-6">
        {player.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.avatar_url}
            alt={player.nickname}
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-amber-400 flex items-center justify-center text-green-900 font-black text-4xl flex-shrink-0">
            {player.nickname[0]}
          </div>
        )}
        <div>
          <div className="text-amber-400 font-black text-3xl">{player.nickname}</div>
          <div className="text-green-200 text-lg">{player.name}</div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {player.handicap != null && (
              <span className="bg-green-700 text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                HCP {player.handicap}
              </span>
            )}
            {player.home_course && (
              <span className="bg-green-700 text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                🏠 {player.home_course}
              </span>
            )}
            {player.on_tour_since && (
              <span className="bg-green-700 text-green-100 text-xs font-semibold px-3 py-1 rounded-full">
                DAM Tour since {player.on_tour_since}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit button — only shown to the profile owner */}
      {isOwner && (
        <div className="flex justify-end mb-6">
          <Link
            href={`/players/${player.id}/edit`}
            className="bg-amber-400 hover:bg-amber-300 text-green-900 font-bold text-sm px-5 py-2 rounded-xl transition-colors"
          >
            ✏️ Edit Profile
          </Link>
        </div>
      )}

      {/* Q&A sections */}
      {SECTIONS.map((section) => {
        const answeredFields = section.fields.filter((f) => answered(f.key));
        if (answeredFields.length === 0) return null;

        return (
          <div key={section.title} className="mb-6">
            <h2 className="text-lg font-black text-green-900 mb-3">
              {section.title}
            </h2>
            <div className="flex flex-col gap-3">
              {answeredFields.map((field) => (
                <div
                  key={field.key}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {field.emoji} {field.label}
                  </div>
                  <div className="text-gray-800 text-sm leading-relaxed">
                    {String(player[field.key as keyof Player])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {SECTIONS.every((s) => s.fields.every((f) => !answered(f.key))) && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-500 text-sm">
            {player.nickname} hasn&apos;t filled in their profile yet.
          </p>
          {isOwner && (
            <Link
              href={`/players/${player.id}/edit`}
              className="mt-4 inline-block bg-green-800 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700"
            >
              Fill it in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
