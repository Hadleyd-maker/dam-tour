const champions = [
  { year: 2026, winner: "TBD", nickname: "???", venue: "TBD", score: "—", note: "First ever DAM Tour champion" },
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
                {c.nickname} &mdash; <span className="font-normal text-gray-600">{c.winner}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {c.venue} &bull; Score: {c.score}
              </div>
              {c.note && (
                <div className="text-xs text-amber-600 italic mt-1">{c.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-10">
        More champions will be added after each annual tour.
      </p>
    </div>
  );
}
