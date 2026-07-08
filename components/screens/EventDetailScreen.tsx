"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import type { SportEvent, User } from "@/lib/store";
import { ArrowLeft, Calendar, Clock, MapPin, Users, MessageCircle, UserCircle } from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";

const SPORT_EMOJI: Record<string, string> = {
  laufen: "🏃", radfahren: "🚴", fitness: "💪", schwimmen: "🏊",
  fussball: "⚽", basketball: "🏀", tennis: "🎾", yoga: "🧘",
  handball: "🤾", volleyball: "🏐",
};

const SPORT_LABELS: Record<string, string> = {
  laufen: "Laufen", radfahren: "Radfahren", fitness: "Fitness", schwimmen: "Schwimmen",
  fussball: "Fußball", basketball: "Basketball", tennis: "Tennis", yoga: "Yoga",
  handball: "Handball", volleyball: "Volleyball",
};

export default function EventDetailScreen() {
  const { viewEventId, events, currentUser, toggleParticipation, setActiveTab, previousTab, setViewUser, fetchUserById, openChat } = useAppStore();
  const [host, setHost] = useState<User | null>(null);

  const event = events.find((e) => e.id === viewEventId) || null;

  useEffect(() => {
    if (event?.userId) {
      fetchUserById(event.userId).then((u) => setHost(u));
    }
  }, [event?.userId, fetchUserById]);

  if (!event) {
    return (
      <div className="h-full flex flex-col bg-white items-center justify-center">
        <p className="text-gray-500">Event nicht gefunden</p>
        <button onClick={() => setActiveTab(previousTab || "feed")} className="text-olive-700 mt-3 text-sm">Zurück</button>
      </div>
    );
  }

  const isParticipant = currentUser && (event.participants || []).includes(currentUser.id);
  const participantCount = (event.participants || []).length;
  const sportLabel = SPORT_LABELS[event.sport] || event.sport;
  const sportEmoji = SPORT_EMOJI[event.sport] || "🏅";

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-200">
        <button onClick={() => setActiveTab(previousTab || "feed")} className="text-gray-700">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-gray-900 font-bold flex-1 truncate">{event.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-28">
        {/* Hero image / gradient */}
        <div className="w-full h-48 bg-olive-50 border-b border-olive-100 flex items-center justify-center">
          <span className="text-7xl drop-shadow-lg">{sportEmoji}</span>
        </div>

        {/* Event info */}
        <div className="px-4 pt-5 pb-4">
          {/* Sport + Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 rounded-full bg-olive-50 text-olive-700 font-medium capitalize border border-olive-200">
              {sportLabel}
            </span>
          </div>
          <h1 className="text-gray-900 text-xl font-bold mt-2">{event.title}</h1>

          {/* Meta info */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <Calendar size={16} className="text-olive-600 flex-shrink-0" />
              <span>{event.date}</span>
              <Clock size={16} className="text-olive-600 flex-shrink-0 ml-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <MapPin size={16} className="text-olive-600 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <Users size={16} className="text-olive-600 flex-shrink-0" />
              <span>{participantCount} Teilnehmer</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h3 className="text-gray-900 font-semibold text-sm mb-2">Beschreibung</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Host info */}
          <div className="mt-5">
            <h3 className="text-gray-500 text-xs font-medium mb-2">Gastgeber</h3>
            <button
              onClick={() => setViewUser(event.userId)}
              className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 text-left hover:bg-gray-100 transition-colors"
            >
              <img
                src={getAvatarUrl(event.username)}
                alt={event.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-semibold">{host?.displayName || event.username}</p>
                <p className="text-gray-500 text-xs">@{event.username}</p>
              </div>
              {currentUser && currentUser.id !== event.userId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openChat(event.userId);
                  }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle size={16} className="text-gray-600" />
                </button>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed CTA Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-7 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={async () => {
            if (!currentUser) { setActiveTab("login"); return; }
            await toggleParticipation(event.id);
          }}
          className={`w-full font-semibold py-3.5 rounded-xl text-base transition-all active:scale-[0.98] ${
            isParticipant
              ? "bg-terra-50 text-terra-500 border border-terra-200"
              : "bg-terra-400 text-white"
          }`}
        >
          {isParticipant ? "✓ Du nimmst teil" : "Teilnehmen"}
        </button>
      </div>
    </div>
  );
}
