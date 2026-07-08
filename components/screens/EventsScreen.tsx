"use client";

import { useState } from "react";
import { useAppStore, getDistance } from "@/lib/store";
import { Calendar, MapPin, Clock, Users, SlidersHorizontal, Navigation } from "lucide-react";
import Header from "@/components/Header";
import { getAvatarUrl } from "@/lib/avatar";

const SPORT_OPTIONS = [
  { id: "alle", label: "Alle Sportarten", emoji: "🏅" },
  { id: "fussball", label: "Fußball", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "laufen", label: "Laufen", emoji: "🏃" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "radfahren", label: "Radfahren", emoji: "🚴" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "schwimmen", label: "Schwimmen", emoji: "🏊" },
  { id: "handball", label: "Handball", emoji: "🤾" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
];

const LEVEL_OPTIONS = [
  { id: "alle", label: "Alle Level" },
  { id: "anfaenger", label: "Anfänger" },
  { id: "fortgeschritten", label: "Fortgeschritten" },
  { id: "profi", label: "Profi" },
];

const TIME_OPTIONS = [
  { id: "alle", label: "Alle" },
  { id: "heute", label: "Heute" },
  { id: "woche", label: "Diese Woche" },
  { id: "monat", label: "Dieser Monat" },
];

export default function EventsScreen() {
  const { events, currentUser, toggleParticipation, setActiveTab, setViewEvent, nearbyUsers, fetchNearbyUsers, updateUserLocation } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [sportFilter, setSportFilter] = useState("alle");
  const [levelFilter, setLevelFilter] = useState("alle");
  const [maxDistance, setMaxDistance] = useState(100);
  const [timeFilter, setTimeFilter] = useState("alle");
  const [locating, setLocating] = useState(false);

  const hasLocation = currentUser?.latitude && currentUser?.longitude;

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateUserLocation(pos.coords.latitude, pos.coords.longitude, currentUser?.city || "Mein Standort");
        await fetchNearbyUsers();
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Build a map of userId -> User for distance/level lookups
  const userMap = new Map(nearbyUsers.map((u) => [u.id, u]));
  if (currentUser) userMap.set(currentUser.id, currentUser);

  const filtered = events.filter((event) => {
    // Sport filter
    if (sportFilter !== "alle" && event.sport !== sportFilter) return false;

    // Level filter (based on event creator's level)
    if (levelFilter !== "alle") {
      const creator = userMap.get(event.userId);
      if (creator && creator.sportStats?.level !== levelFilter) return false;
    }

    // Distance filter (based on event creator's location)
    if (hasLocation && maxDistance < 100) {
      const creator = userMap.get(event.userId);
      if (creator?.latitude && creator?.longitude) {
        const dist = getDistance(currentUser!.latitude, currentUser!.longitude, creator.latitude, creator.longitude);
        if (dist > maxDistance) return false;
      }
    }

    // Time filter
    if (timeFilter !== "alle") {
      const eventDate = new Date(event.date);
      const now = new Date();
      if (timeFilter === "heute") {
        if (eventDate.toDateString() !== now.toDateString()) return false;
      } else if (timeFilter === "woche") {
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);
        if (eventDate > weekFromNow || eventDate < now) return false;
      } else if (timeFilter === "monat") {
        const monthFromNow = new Date(now);
        monthFromNow.setMonth(now.getMonth() + 1);
        if (eventDate > monthFromNow || eventDate < now) return false;
      }
    }

    return true;
  });

  const upcoming = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const activeFilterCount = [
    sportFilter !== "alle",
    levelFilter !== "alle",
    maxDistance < 100,
    timeFilter !== "alle",
  ].filter(Boolean).length;

  return (
    <div className="h-full flex flex-col bg-olive-700">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Kommende Events</h2>
              <p className="text-olive-300 text-sm mt-0.5">Entdecke Sport-Events in deiner Nähe</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2.5 rounded-xl transition-all ${showFilters ? "bg-olive-600 text-terra-400" : "bg-olive-600 text-olive-300"}`}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terra-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mx-4 mb-3 p-4 bg-olive-600 border border-olive-500 rounded-2xl animate-fade-in space-y-4">
            {/* Sport filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">Sportart</label>
              <div className="flex flex-wrap gap-1.5">
                {SPORT_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSportFilter(s.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      sportFilter === s.id
                        ? "bg-terra-400/20 text-terra-300 border border-terra-400/40"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
                    }`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance filter */}
            {currentUser && (
              <div>
                <label className="text-olive-200 text-xs font-medium mb-2 block">
                  Max. Entfernung: <span className="text-terra-300">{maxDistance} km</span>
                </label>
                {hasLocation ? (
                  <>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="w-full accent-olive-600"
                    />
                    <div className="flex justify-between text-[10px] text-olive-400 mt-1">
                      <span>1 km</span>
                      <span>100 km</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={requestLocation}
                    disabled={locating}
                    className="w-full flex items-center justify-center gap-2 bg-olive-700 text-olive-200 text-xs font-medium py-2.5 rounded-xl border border-olive-500"
                  >
                    <Navigation size={14} />
                    {locating ? "Wird ermittelt..." : "Standort aktivieren für Entfernung"}
                  </button>
                )}
              </div>
            )}

            {/* Level filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">Leistungsklasse</label>
              <div className="flex gap-1.5">
                {LEVEL_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevelFilter(l.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      levelFilter === l.id
                        ? "bg-terra-400/20 text-terra-300 border border-terra-400/40"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">Zeitraum</label>
              <div className="flex gap-1.5">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimeFilter(t.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      timeFilter === t.id
                        ? "bg-terra-400/20 text-terra-300 border border-terra-400/40"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset button */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSportFilter("alle"); setLevelFilter("alle"); setMaxDistance(100); setTimeFilter("alle"); }}
                className="w-full text-xs text-olive-300 hover:text-white py-1.5 transition-colors"
              >
                Alle Filter zurücksetzen
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="px-4 py-1">
          <p className="text-olive-300 text-xs">{upcoming.length} Events gefunden</p>
        </div>

        <div className="px-4 space-y-3 pt-2">
          {upcoming.length > 0 ? upcoming.map((event, index) => (
            <button
              key={event.id}
              onClick={() => setViewEvent(event.id)}
              className="animate-fade-in bg-olive-600 rounded-2xl overflow-hidden border border-olive-500 w-full text-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Color bar */}
              <div className="h-1.5 bg-terra-400" />

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-base">{event.title}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <img src={getAvatarUrl(event.username)} alt={event.username} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-olive-300 text-xs">@{event.username}</span>
                    </div>
                  </div>
                  <span className="text-2xl ml-3">
                    {event.sport === "fussball" ? "⚽" : event.sport === "fitness" ? "💪" : event.sport === "laufen" ? "🏃" : event.sport === "yoga" ? "🧘" : event.sport === "radfahren" ? "🚴" : "🏅"}
                  </span>
                </div>

                <p className="text-olive-200 text-sm mt-2 line-clamp-2">{event.description}</p>

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
                  <div className="flex items-center gap-1 text-olive-300 text-xs">
                    <Users size={14} />
                    <span>{(event.participants || []).length} Teilnehmer</span>
                  </div>
                  {(() => {
                    const isParticipant = currentUser && (event.participants || []).includes(currentUser.id);
                    return (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!currentUser) { setActiveTab("login"); return; }
                          await toggleParticipation(event.id);
                        }}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                          isParticipant
                            ? "bg-terra-400 text-white"
                            : "bg-terra-50 text-terra-500 border border-terra-200 hover:bg-terra-100"
                        }`}
                      >
                        {isParticipant ? "✓ Dabei" : "Teilnehmen"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </button>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white font-semibold text-lg">Keine Events gefunden</h3>
              <p className="text-olive-200 text-sm text-center mt-2">
                Passe deine Filter an oder erstelle selbst ein Event!
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSportFilter("alle"); setLevelFilter("alle"); setMaxDistance(100); setTimeFilter("alle"); }}
                  className="mt-4 bg-terra-400/20 text-terra-300 border border-terra-400/40 text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
