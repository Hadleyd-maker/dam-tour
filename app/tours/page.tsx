const tours = [
  {
    year: 2026,
    status: "upcoming",
    venue: "TBD",
    date: "TBD",
    format: "TBD",
    players: 13,
  },
];

export default function ToursPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-green-900 mb-1">Tours</h1>
      <p className="text-gray-500 text-sm mb-8">Past and upcoming DAM Tour events.</p>

      <div className="flex flex-col gap-4">
        {tours.map((tour) => (
          <div
            key={tour.year}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-black text-green-900">{tour.year} Tour</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  tour.status === "upcoming"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {tour.status === "upcoming" ? "Upcoming" : "Completed"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Venue</div>
                <div className="font-semibold text-gray-700">{tour.venue}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Date</div>
                <div className="font-semibold text-gray-700">{tour.date}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Format</div>
                <div className="font-semibold text-gray-700">{tour.format}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Players</div>
                <div className="font-semibold text-gray-700">{tour.players}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 text-xs mt-10">
        Tour details will be updated as they are confirmed.
      </p>
    </div>
  );
}
