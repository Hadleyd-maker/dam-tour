const players = [
  { nickname: "Grumpy", name: "David Hadley" },
  { nickname: "Beavis", name: "Darren Chester" },
  { nickname: "Reverend", name: "Nick Toplis" },
  { nickname: "Pudding", name: "Ken Arthur" },
  { nickname: "Stretch", name: "Stefan Sickel" },
  { nickname: "Hightower", name: "Alan Wilkinson" },
  { nickname: "Venootski", name: "Peter Menelaou" },
  { nickname: "Roofrack", name: "Malcolm Cobbett" },
  { nickname: "Rhino", name: "James Patla" },
  { nickname: "Butthead", name: "Siegie Finger" },
  { nickname: "Enos", name: "Steve Francis" },
  { nickname: "Cricket", name: "Gavin Maher" },
  { nickname: "Minion", name: "Spencer Haydock" },
  { nickname: "Fiddles", name: "Werner Rooseboom" },
  { nickname: "Gupta", name: "Greg Vaughan" },
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
              {player.nickname[0]}
            </div>
            <div>
              <div className="font-bold text-green-900 text-lg">{player.nickname}</div>
              <div className="text-gray-500 text-sm">{player.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
