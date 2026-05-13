"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";

const SPORT_FILTERS = [
  { id: "alle", label: "Alle", emoji: "🏅" },
  { id: "fussball", label: "Fußball", emoji: "⚽" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "laufen", label: "Laufen", emoji: "🏃" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "radfahren", label: "Rad", emoji: "🚴" },
];

export default function SearchScreen() {
  const { events } = useAppStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("alle");

  const filtered = events.filter((e) => {
    const matchesQuery =
      !query ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.description.toLowerCase().includes(query.toLowerCase()) ||
      e.location.toLowerCase().includes(query.toLowerCase()) ||
      e.username.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "alle" || e.sport === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Search bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Events, Sportarten, Orte suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all text-sm"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {SPORT_FILTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === s.id
                  ? "bg-gray-200 text-gray-900 border border-gray-300"
                  : "bg-gray-100 text-gray-500 border border-transparent"
              }`}
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="pt-2">
          {filtered.length > 0 ? (
            filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-900">Keine Ergebnisse</h2>
              <p className="text-gray-400 text-sm text-center mt-2">
                Versuche einen anderen Suchbegriff oder Filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
