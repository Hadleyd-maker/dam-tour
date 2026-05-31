import Link from "next/link";

const cards = [
  {
    href: "/players",
    emoji: "🏌️",
    title: "Players",
    desc: "Meet the 15 legends of the DAM Tour",
  },
  {
    href: "/champions",
    emoji: "🏆",
    title: "Champions",
    desc: "Hall of fame — past tour winners",
  },
  {
    href: "/tours",
    emoji: "📅",
    title: "Tours",
    desc: "Upcoming events and past results",
  },
  {
    href: "/gallery",
    emoji: "📸",
    title: "Gallery",
    desc: "Photos from the fairways and the 19th hole",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-green-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-amber-400 text-6xl font-black tracking-tight mb-2">
            DAM TOUR
          </div>
          <p className="text-green-400 text-sm">Est. 2006 &bull; 15 Players &bull; Annual Championship</p>
        </div>
      </div>

      {/* Nav cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-green-300 transition-all"
            >
              <span className="text-4xl">{card.emoji}</span>
              <span className="font-bold text-green-900 text-base">{card.title}</span>
              <span className="text-gray-500 text-xs leading-snug">{card.desc}</span>
            </Link>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-black text-amber-500">2006</div>
            <div className="text-xs text-gray-500 mt-1">Founded</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-700">15</div>
            <div className="text-xs text-gray-500 mt-1">Players</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-700">1</div>
            <div className="text-xs text-gray-500 mt-1">Champion</div>
          </div>
        </div>
      </div>
    </div>
  );
}
