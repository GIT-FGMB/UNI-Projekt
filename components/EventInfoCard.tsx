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
  const { currentUser, toggleParticipation, setActiveTab, setViewUser, setViewEvent } = useAppStore();

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
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-olive-600 text-olive-100 font-medium border border-olive-500">EVENT</span>
          </div>
          <p className="text-olive-300 text-xs">{timeAgo()}</p>
        </div>
        <span className="text-2xl">{SPORT_EMOJI[event.sport] || "🏅"}</span>
      </button>

      {/* Event info card */}
      <div onClick={() => setViewEvent(event.id)} className="mx-4 bg-olive-600 rounded-2xl border border-olive-500 overflow-hidden w-[calc(100%-2rem)] text-left cursor-pointer">
        <div className="h-1.5 bg-terra-400" />
        <div className="p-4">
          <h3 className="text-white font-bold text-base">{event.title}</h3>
          <p className="text-olive-200 text-sm mt-1 line-clamp-2">{event.description}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-olive-300">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-terra-300" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-terra-300" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-terra-300" />
              {event.location}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-olive-500">
            <div className="flex items-center gap-1.5 text-olive-300 text-xs">
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
                  ? "bg-terra-400 text-white"
                  : "bg-terra-400/20 text-terra-300 border border-terra-400/40 hover:bg-terra-400/30"
              }`}
            >
              {isParticipant ? "✓ Dabei" : "Teilnehmen"}
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-olive-600 mx-4 mt-4" />
    </div>
  );
}
