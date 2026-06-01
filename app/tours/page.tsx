const tours = [
  {
    year: 2026,
    status: "completed",
    location: "Cape Town, South Africa",
    dates: "27–31 May 2026",
    accommodation: "Commodore Hotel, V&A Waterfront",
    champion: "Minion",
    championFull: "Spencer Haydock",
    itinerary: [
      { date: "Tue 27 May", event: "Arrival & Gala Dinner", detail: "Diaz Tavern", icon: "🍽️" },
      { date: "Wed 28 May", event: "Steenberg Golf Club", detail: "Round 1", icon: "⛳" },
      { date: "Thu 29 May", event: "Clovelly Country Club", detail: "Round 2", icon: "⛳" },
      { date: "Fri 30 May", event: "De Zalze Golf Club", detail: "Round 3", icon: "⛳" },
      { date: "Sat 31 May", event: "Monument Golf Club", detail: "Round 4 — Final", icon: "🏆" },
    ],
  },
  {
    year: 2024,
    status: "completed",
    location: "TBD",
    dates: "TBD",
    accommodation: "TBD",
    champion: "Stretch",
    championFull: "Stefan Sickel",
    itinerary: [],
  },
];

export default function ToursPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">Tours</h1>
      <p className="text-gray-500 text-sm mb-8">Every DAM Tour, every year.</p>

      <div className="flex flex-col gap-6">
        {tours.map((tour) => (
          <div key={tour.year} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-green-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-amber-400">{tour.year} Tour</span>
                <p className="text-green-200 text-sm mt-0.5">{tour.location}</p>
              </div>
              <span className="bg-amber-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                {tour.status === "completed" ? "Completed" : "Upcoming"}
              </span>
            </div>

            {/* Details */}
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-gray-100">
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Dates</div>
                <div className="font-semibold text-gray-700 text-sm">{tour.dates}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Accommodation</div>
                <div className="font-semibold text-gray-700 text-sm">{tour.accommodation}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Champion</div>
                <div className="font-semibold text-green-700 text-sm">
                  🏆 {tour.champion} <span className="text-gray-400 font-normal">({tour.championFull})</span>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary.length > 0 && (
              <div className="px-6 py-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Itinerary</div>
                <div className="flex flex-col gap-2">
                  {tour.itinerary.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xl w-7 text-center">{item.icon}</span>
                      <span className="text-gray-400 text-xs w-24 flex-shrink-0">{item.date}</span>
                      <span className="font-semibold text-gray-800 text-sm">{item.event}</span>
                      <span className="text-gray-400 text-xs">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-10">
        More tour history being added — all the way back to 2006.
      </p>
    </div>
  );
}
