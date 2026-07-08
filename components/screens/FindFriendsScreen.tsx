"use client";

import { useState, useEffect } from "react";
import { MapPin, SlidersHorizontal, Navigation, Users, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useAppStore, getDistance, LEVEL_LABELS } from "@/lib/store";
import type { User } from "@/lib/store";
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
  const { currentUser, followUser, unfollowUser, setViewUser, openChat } = useAppStore();
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
    <div className="mx-4 mb-3 bg-olive-600 rounded-2xl border border-olive-500 overflow-hidden animate-fade-in">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={getAvatarUrl(user.username)}
            alt={user.username}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0 cursor-pointer"
            onClick={() => setViewUser(user.id)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-white font-semibold text-sm cursor-pointer hover:underline"
                  onClick={() => setViewUser(user.id)}
                >{user.displayName}</h3>
                <p
                  className="text-olive-300 text-xs cursor-pointer hover:underline"
                  onClick={() => setViewUser(user.id)}
                >@{user.username}</p>
              </div>
              {distance !== null && (
                <span className="flex items-center gap-1 text-olive-200 text-xs font-medium bg-olive-700 px-2.5 py-1 rounded-full border border-olive-500">
                  <Navigation size={10} />
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {(user.sports || [user.sport]).map((sp) => (
                <span key={sp} className="text-xs px-2 py-0.5 rounded-full bg-olive-700 text-olive-200 border border-olive-500">
                  {SPORT_OPTIONS.find((s) => s.id === sp)?.emoji} {SPORT_OPTIONS.find((s) => s.id === sp)?.label || sp}
                </span>
              ))}
              {user.age > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-olive-700 text-olive-200 border border-olive-500">
                  {user.age} Jahre
                </span>
              )}
              {user.sportStats?.level && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  user.sportStats.level === "profi" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  user.sportStats.level === "fortgeschritten" ? "bg-olive-50 text-olive-700 border-olive-200" :
                  "bg-olive-700 text-olive-200 border-olive-500"
                }`}>
                  {LEVEL_LABELS[user.sportStats.level]}
                </span>
              )}
            </div>

            {/* Sport Stats */}
            {user.sportStats && (
              <div className="flex flex-wrap gap-2 mt-2">
                {user.sportStats.pace && (
                  <span className="text-[11px] text-olive-300">⏱️ {user.sportStats.pace}</span>
                )}
                {user.sportStats.distance && (
                  <span className="text-[11px] text-olive-300">📏 {user.sportStats.distance}</span>
                )}
                {user.sportStats.frequency && (
                  <span className="text-[11px] text-olive-300">📅 {user.sportStats.frequency}</span>
                )}
                {user.sportStats.strength && (
                  <span className="text-[11px] text-olive-300">💪 {user.sportStats.strength}</span>
                )}
              </div>
            )}

            {user.city && (
              <div className="flex items-center gap-1 mt-2 text-olive-300 text-xs">
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
                ? "bg-olive-700 text-olive-200 border border-olive-500 hover:bg-red-900/30 hover:text-red-400"
                : "bg-terra-400 text-white"
            }`}
          >
            <Users size={13} />
            {loading ? "..." : isFollowing ? "Entfolgen" : "Folgen"}
          </button>
          <button
            onClick={() => openChat(user.id)}
            className="flex-1 bg-olive-700 text-olive-200 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-olive-800 transition-colors border border-olive-500"
          >
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
      <div className="h-full flex flex-col bg-olive-700">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-xl font-bold text-white">Freunde finden</h2>
          <p className="text-olive-200 text-sm text-center mt-2">Melde dich an, um Sportler in deiner Nähe zu finden!</p>
          <button
            onClick={() => setActiveTab("login")}
            className="mt-6 bg-olive-700 text-white font-semibold px-6 py-3 rounded-xl"
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
    const userSports = user.sports || [user.sport];
    if (sportFilter !== "alle" && !userSports.includes(sportFilter)) return false;
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
    <div className="h-full flex flex-col bg-olive-700">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Title & Location */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Freunde finden</h2>
              <p className="text-olive-300 text-sm mt-0.5">Sportler in deiner Nähe</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition-all ${showFilters ? "bg-olive-600 text-terra-400" : "bg-olive-600 text-olive-300"}`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Location button */}
          {!hasLocation && (
            <button
              onClick={requestLocation}
              disabled={locating}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-olive-700 text-white text-sm font-semibold py-3 rounded-xl"
            >
              <Navigation size={16} />
              {locating ? "Standort wird ermittelt..." : "Standort aktivieren"}
            </button>
          )}
          {hasLocation && (
            <button
              onClick={requestLocation}
              className="mt-2 flex items-center gap-1.5 text-olive-300 text-xs"
            >
              <Navigation size={12} />
              <span>Standort aktualisieren</span>
              {currentUser.city && <span className="text-olive-400">({currentUser.city})</span>}
            </button>
          )}
          {locError && <p className="text-red-400 text-xs mt-2">{locError}</p>}
        </div>

        {/* Filters */}
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
                        ? "bg-olive-50 text-olive-700 border border-olive-300"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
                    }`}
                  >
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">
                Max. Entfernung: <span className="text-terra-300">{maxDistance} km</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-olive-400"
              />
              <div className="flex justify-between text-[10px] text-olive-400 mt-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            {/* Age filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">Alter</label>
              <div className="flex gap-1.5">
                {AGE_RANGES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setAgeRange(r)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      ageRange.label === r.label
                        ? "bg-olive-50 text-olive-700 border border-olive-300"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level filter */}
            <div>
              <label className="text-olive-200 text-xs font-medium mb-2 block">Level</label>
              <div className="flex gap-1.5">
                {LEVEL_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevelFilter(l.id)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      levelFilter === l.id
                        ? "bg-olive-50 text-olive-700 border border-olive-300"
                        : "bg-olive-700 text-olive-300 border border-olive-500"
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
          <p className="text-olive-300 text-xs">{sorted.length} Sportler gefunden</p>
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
            <p className="text-gray-500 text-sm text-center mt-2">
              Passe deine Filter an oder vergrößere den Suchradius.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
