"use client";

import { useState, useEffect } from "react";
import { MapPin, SlidersHorizontal, Navigation, Users, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useAppStore, getDistance, LEVEL_LABELS } from "@/lib/store";
import type { User } from "@/lib/store";
import Header from "@/components/Header";

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
];

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];
const AGE_RANGES = [
  { label: "Alle", min: 0, max: 999 },
  { label: "16–25", min: 16, max: 25 },
  { label: "26–35", min: 26, max: 35 },
  { label: "36–50", min: 36, max: 50 },
  { label: "50+", min: 50, max: 999 },
];
const LEVEL_OPTIONS = [
  { id: "alle", label: "Alle Level" },
  { id: "anfaenger", label: "Anfänger" },
  { id: "fortgeschritten", label: "Fortgeschritten" },
  { id: "profi", label: "Profi" },
];

function UserCard({ user, distance }: { user: User; distance: number | null }) {
  const { currentUser, followUser, unfollowUser } = useAppStore();
  const isFollowing = (currentUser?.followingList || []).includes(user.id);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    if (isFollowing) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }
    setLoading(false);
  };

  return (
    <div className="mx-4 mb-3 gradient-card rounded-2xl border border-gray-800/50 overflow-hidden animate-fade-in">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm">{user.displayName}</h3>
                <p className="text-gray-400 text-xs">@{user.username}</p>
              </div>
              {distance !== null && (
                <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2.5 py-1 rounded-full">
                  <Navigation size={10} />
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                {SPORT_OPTIONS.find((s) => s.id === user.sport)?.emoji} {SPORT_OPTIONS.find((s) => s.id === user.sport)?.label || user.sport}
              </span>
              {user.age > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                  {user.age} Jahre
                </span>
              )}
              {user.sportStats?.level && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.sportStats.level === "profi" ? "bg-yellow-500/15 text-yellow-400" :
                  user.sportStats.level === "fortgeschritten" ? "bg-blue-500/15 text-blue-400" :
                  "bg-gray-700 text-gray-300"
                }`}>
                  {LEVEL_LABELS[user.sportStats.level]}
                </span>
              )}
            </div>

            {/* Sport Stats */}
            {user.sportStats && (
              <div className="flex flex-wrap gap-2 mt-2">
                {user.sportStats.pace && (
                  <span className="text-[11px] text-gray-400">⏱️ {user.sportStats.pace}</span>
                )}
                {user.sportStats.distance && (
                  <span className="text-[11px] text-gray-400">📏 {user.sportStats.distance}</span>
                )}
                {user.sportStats.frequency && (
                  <span className="text-[11px] text-gray-400">📅 {user.sportStats.frequency}</span>
                )}
                {user.sportStats.strength && (
                  <span className="text-[11px] text-gray-400">💪 {user.sportStats.strength}</span>
                )}
              </div>
            )}

            {user.city && (
              <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                <MapPin size={10} />
                {user.city}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              isFollowing
                ? "bg-gray-800 text-gray-300 hover:bg-red-500/15 hover:text-red-400"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
            }`}
          >
            <Users size={13} />
            {loading ? "..." : isFollowing ? "Entfolgen" : "Folgen"}
          </button>
          <button className="flex-1 bg-gray-800 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-gray-700 transition-colors">
            <MessageCircle size={13} />
            Nachricht
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FindFriendsScreen() {
  const { currentUser, nearbyUsers, fetchNearbyUsers, updateUserLocation, setActiveTab } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [sportFilter, setSportFilter] = useState("alle");
  const [maxDistance, setMaxDistance] = useState(25);
  const [ageRange, setAgeRange] = useState(AGE_RANGES[0]);
  const [levelFilter, setLevelFilter] = useState("alle");
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchNearbyUsers();
    }
  }, [currentUser, fetchNearbyUsers]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation wird nicht unterstützt");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateUserLocation(pos.coords.latitude, pos.coords.longitude, currentUser?.city || "Mein Standort");
        await fetchNearbyUsers();
        setLocating(false);
      },
      (err) => {
        setLocError("Standort konnte nicht ermittelt werden. Bitte erlaube den Zugriff.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col bg-gray-950">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-xl font-bold text-white">Freunde finden</h2>
          <p className="text-gray-400 text-sm text-center mt-2">Melde dich an, um Sportler in deiner Nähe zu finden!</p>
          <button
            onClick={() => setActiveTab("login")}
            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl"
          >
            Jetzt anmelden
          </button>
        </div>
      </div>
    );
  }

  const hasLocation = currentUser.latitude && currentUser.longitude;

  const usersWithDistance = nearbyUsers.map((u) => ({
    user: u,
    distance: hasLocation && u.latitude && u.longitude
      ? getDistance(currentUser.latitude, currentUser.longitude, u.latitude, u.longitude)
      : null,
  }));

  const filtered = usersWithDistance.filter(({ user, distance }) => {
    if (sportFilter !== "alle" && user.sport !== sportFilter) return false;
    if (distance !== null && distance > maxDistance) return false;
    if (user.age > 0 && (user.age < ageRange.min || user.age > ageRange.max)) return false;
    if (levelFilter !== "alle" && user.sportStats?.level !== levelFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    if (a.distance !== null) return -1;
    if (b.distance !== null) return 1;
    return 0;
  });

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Title & Location */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Freunde finden</h2>
              <p className="text-gray-400 text-sm mt-0.5">Sportler in deiner Nähe</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-all ${showFilters ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Location button */}
          {!hasLocation && (
            <button
              onClick={requestLocation}
              disabled={locating}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-3 rounded-xl"
            >
              <Navigation size={16} />
              {locating ? "Standort wird ermittelt..." : "Standort aktivieren"}
            </button>
          )}
          {hasLocation && (
            <button
              onClick={requestLocation}
              className="mt-2 flex items-center gap-1.5 text-green-400 text-xs"
            >
              <Navigation size={12} />
              <span>Standort aktualisieren</span>
              {currentUser.city && <span className="text-gray-500">({currentUser.city})</span>}
            </button>
          )}
          {locError && <p className="text-red-400 text-xs mt-2">{locError}</p>}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mx-4 mb-3 p-4 bg-gray-900/80 border border-gray-800 rounded-2xl animate-fade-in space-y-4">
            {/* Sport filter */}
            <div>
              <label className="text-gray-400 text-xs font-medium mb-2 block">Sportart</label>
              <div className="flex flex-wrap gap-1.5">
                {SPORT_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSportFilter(s.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      sportFilter === s.id
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-800 text-gray-400 border border-transparent"
                    }`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance filter */}
            <div>
              <label className="text-gray-400 text-xs font-medium mb-2 block">
                Max. Entfernung: <span className="text-green-400">{maxDistance} km</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            {/* Age filter */}
            <div>
              <label className="text-gray-400 text-xs font-medium mb-2 block">Alter</label>
              <div className="flex gap-1.5">
                {AGE_RANGES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setAgeRange(r)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      ageRange.label === r.label
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-800 text-gray-400 border border-transparent"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level filter */}
            <div>
              <label className="text-gray-400 text-xs font-medium mb-2 block">Level</label>
              <div className="flex gap-1.5">
                {LEVEL_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevelFilter(l.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      levelFilter === l.id
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-800 text-gray-400 border border-transparent"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="px-4 py-2">
          <p className="text-gray-500 text-xs">{sorted.length} Sportler gefunden</p>
        </div>

        {/* User list */}
        {sorted.length > 0 ? (
          sorted.map(({ user, distance }) => (
            <UserCard key={user.id} user={user} distance={distance} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-lg">Keine Sportler gefunden</h3>
            <p className="text-gray-400 text-sm text-center mt-2">
              Passe deine Filter an oder vergrößere den Suchradius.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
