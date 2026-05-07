"use client";

import { useAppStore } from "@/lib/store";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import { getAvatarUrl } from "@/lib/avatar";

export default function EventsScreen() {
  const { events, currentUser, toggleParticipation, setActiveTab } = useAppStore();

  const upcoming = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-white">Kommende Events</h2>
          <p className="text-gray-400 text-sm mt-1">Entdecke Sport-Events in deiner Nähe</p>
        </div>

        <div className="px-4 space-y-3 pt-2">
          {upcoming.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in gradient-card rounded-2xl overflow-hidden border border-gray-800/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Color bar */}
              <div className={`h-1.5 bg-gradient-to-r ${event.image}`} />

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base">{event.title}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <img src={getAvatarUrl(event.username)} alt={event.username} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-gray-400 text-xs">@{event.username}</span>
                    </div>
                  </div>
                  <span className="text-2xl ml-3">
                    {event.sport === "fussball" ? "⚽" : event.sport === "fitness" ? "💪" : event.sport === "laufen" ? "🏃" : event.sport === "yoga" ? "🧘" : event.sport === "radfahren" ? "🚴" : "🏅"}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>

                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-green-400" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-green-400" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-green-400" />
                    {event.location}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/50">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Users size={14} />
                    <span>{(event.participants || []).length} Teilnehmer</span>
                  </div>
                  {(() => {
                    const isParticipant = currentUser && (event.participants || []).includes(currentUser.id);
                    return (
                      <button
                        onClick={async () => {
                          if (!currentUser) { setActiveTab("login"); return; }
                          await toggleParticipation(event.id);
                        }}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                          isParticipant
                            ? "bg-green-500 text-white"
                            : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                        }`}
                      >
                        {isParticipant ? "✓ Dabei" : "Teilnehmen"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
