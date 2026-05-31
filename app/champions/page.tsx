const champions = [
  { year: 2026, winner: "Spencer Haydock", nickname: "Minion", venue: "TBD", score: "—" },
  { year: 2024, winner: "Stefan Sickel", nickname: "Stretch", venue: "TBD", score: "—" },
];

export default function ChampionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">Hall of Champions</h1>
      <p className="text-gray-500 text-sm mb-8">The immortals of the DAM Tour.</p>

      <div className="flex flex-col gap-4">
        {champions.map((c) => (
          <div
            key={c.year}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-6"
          >
            <div className="text-5xl">🏆</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black text-amber-500">{c.year}</span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Champion
                </span>
              </div>
              <div className="text-xl font-bold text-green-900">
                {c.nickname}{" "}
                <span className="font-normal text-gray-500 text-base">{c.winner}</span>
              </div>
              {c.venue !== "TBD" && (
                <div className="text-sm text-gray-500 mt-1">
                  {c.venue} &bull; Score: {c.score}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-10">
        More champions being added — send them through and we&apos;ll complete the history back to 2006.
      </p>
    </div>
  );
}
