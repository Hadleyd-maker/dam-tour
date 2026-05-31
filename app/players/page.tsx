const players = [
  { nickname: "The Gaffer", name: "Dave", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 2", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 3", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 4", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 5", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 6", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 7", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 8", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 9", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 10", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 11", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 12", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 13", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 14", handicap: null, note: "" },
  { nickname: "TBD", name: "Player 15", handicap: null, note: "" },
];

export default function PlayersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">The Players</h1>
      <p className="text-gray-500 text-sm mb-8">15 legends. One tour.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black text-lg flex-shrink-0">
              {player.name[0]}
            </div>
            <div>
              <div className="font-bold text-green-900">{player.nickname}</div>
              <div className="text-gray-500 text-sm">{player.name}</div>
              {player.note && (
                <div className="text-amber-600 text-xs mt-0.5 italic">{player.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-10">
        Player details coming soon — add your nickname, handicap and photo.
      </p>
    </div>
  );
}
