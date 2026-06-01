"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("players")
      .select("*")
      .order("nickname")
      .then(({ data }) => {
        setPlayers(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-400">
        Loading players…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">The Players</h1>
      <p className="text-gray-500 text-sm mb-8">15 legends. One tour.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-green-300 transition-all"
          >
            {/* Avatar */}
            {player.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.avatar_url}
                alt={player.nickname}
                className="w-20 h-20 rounded-full object-cover border-2 border-green-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black text-3xl border-2 border-green-200">
                {player.nickname[0]}
              </div>
            )}
            <div>
              <div className="font-black text-green-900 text-lg leading-tight">
                {player.nickname}
              </div>
              <div className="text-gray-500 text-sm">{player.name}</div>
              {player.handicap != null && (
                <div className="text-amber-600 text-xs mt-1 font-semibold">
                  HCP {player.handicap}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
