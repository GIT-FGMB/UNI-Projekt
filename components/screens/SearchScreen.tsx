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
    <div className="h-full flex flex-col bg-gray-950">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Search bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Events, Sportarten, Orte suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white placeholder-gray-500 focus:outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {SPORT_FILTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === s.id
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-900 text-gray-400 border border-gray-800"
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
              <h3 className="text-white font-semibold text-lg">Keine Ergebnisse</h3>
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
