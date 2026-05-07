"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { SportEvent, useAppStore } from "@/lib/store";
import { getAvatarUrl } from "@/lib/avatar";

const SPORT_EMOJI: Record<string, string> = {
  laufen: "🏃", radfahren: "🚴", fitness: "💪", schwimmen: "🏊",
  fussball: "⚽", basketball: "🏀", tennis: "🎾", yoga: "🧘",
  handball: "🤾", volleyball: "🏐",
};

export default function EventInfoCard({ event }: { event: SportEvent }) {
  const { currentUser, toggleParticipation, setActiveTab, setViewUser } = useAppStore();

  const isParticipant = currentUser && (event.participants || []).includes(currentUser.id);
  const participantCount = (event.participants || []).length;

  const timeAgo = () => {
    const diff = Date.now() - new Date(event.createdAt).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Gerade eben";
    if (hours < 24) return `vor ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `vor ${days}T`;
    return `vor ${Math.floor(days / 7)}W`;
  };

  return (
    <div className="animate-fade-in mb-4">
      {/* User header - clickable */}
      <button
        onClick={() => setViewUser(event.userId)}
        className="flex items-center gap-3 px-4 py-3 w-full text-left"
      >
        <img src={getAvatarUrl(event.username)} alt={event.username} className="w-9 h-9 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-semibold">{event.username}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">EVENT</span>
          </div>
          <p className="text-gray-500 text-xs">{timeAgo()}</p>
        </div>
        <span className="text-2xl">{SPORT_EMOJI[event.sport] || "🏅"}</span>
      </button>

      {/* Event info card */}
      <div className="mx-4 gradient-card rounded-2xl border border-blue-500/20 overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${event.image}`} />
        <div className="p-4">
          <h3 className="text-white font-bold text-base">{event.title}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-blue-400" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-blue-400" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-blue-400" />
              {event.location}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/50">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Users size={14} />
              <span>{participantCount} Teilnehmer</span>
            </div>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!currentUser) { setActiveTab("login"); return; }
                await toggleParticipation(event.id);
              }}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                isParticipant
                  ? "bg-green-500 text-white"
                  : "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
              }`}
            >
              {isParticipant ? "✓ Dabei" : "Teilnehmen"}
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-800/50 mx-4 mt-4" />
    </div>
  );
}
