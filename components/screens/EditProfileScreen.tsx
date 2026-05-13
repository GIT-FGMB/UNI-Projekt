"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { SportStats } from "@/lib/store";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { getAvatarUrl } from "@/lib/avatar";

const SPORTS = [
  { id: "fussball", label: "Fußball", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "schwimmen", label: "Schwimmen", emoji: "🏊" },
  { id: "laufen", label: "Laufen", emoji: "🏃" },
  { id: "radfahren", label: "Radfahren", emoji: "🚴" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "handball", label: "Handball", emoji: "🤾" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐" },
];

const INPUT_CLASS = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all text-sm";

export default function EditProfileScreen() {
  const { currentUser, updateProfile, updateUserLocation, setActiveTab } = useAppStore();
  if (!currentUser) return null;

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [city, setCity] = useState(currentUser.city || "");
  const [age, setAge] = useState(String(currentUser.age || ""));
  const [sports, setSports] = useState<string[]>(currentUser.sports || [currentUser.sport]);
  const [perSportStats, setPerSportStats] = useState<Record<string, { level: SportStats["level"]; frequency: string; values: Record<string, string> }>>(() => {
    // Initialize from existing sportsStats or legacy sportStats
    const existing = currentUser.sportsStats || {};
    const init: Record<string, { level: SportStats["level"]; frequency: string; values: Record<string, string> }> = {};
    const userSports = currentUser.sports || [currentUser.sport];
    for (const sp of userSports) {
      if (existing[sp]) {
        init[sp] = {
          level: existing[sp].level || "anfaenger",
          frequency: existing[sp].frequency || "",
          values: {
            ...(existing[sp].pace ? { pace: existing[sp].pace! } : {}),
            ...(existing[sp].distance ? { distance: existing[sp].distance! } : {}),
            ...(existing[sp].strength ? { strength: existing[sp].strength! } : {}),
          },
        };
      } else if (sp === currentUser.sport && currentUser.sportStats) {
        init[sp] = {
          level: currentUser.sportStats.level || "anfaenger",
          frequency: currentUser.sportStats.frequency || "",
          values: {
            ...(currentUser.sportStats.pace ? { pace: currentUser.sportStats.pace } : {}),
            ...(currentUser.sportStats.distance ? { distance: currentUser.sportStats.distance } : {}),
            ...(currentUser.sportStats.strength ? { strength: currentUser.sportStats.strength } : {}),
          },
        };
      }
    }
    return init;
  });
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);

  const getOrInitSportStat = (sportId: string) => {
    return perSportStats[sportId] || { level: "anfaenger" as SportStats["level"], frequency: "", values: {} };
  };

  const updateSportStat = (sportId: string, field: string, value: any) => {
    const current = getOrInitSportStat(sportId);
    setPerSportStats({ ...perSportStats, [sportId]: { ...current, [field]: value } });
  };

  const updateSportStatValue = (sportId: string, key: string, value: string) => {
    const current = getOrInitSportStat(sportId);
    setPerSportStats({ ...perSportStats, [sportId]: { ...current, values: { ...current.values, [key]: value } } });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateUserLocation(pos.coords.latitude, pos.coords.longitude, city || "Mein Standort");
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const SPORT_STAT_FIELDS: Record<string, { label: string; placeholder: string; key: string }[]> = {
    laufen: [
      { label: "Tempo (min/km)", placeholder: "z.B. 5:30", key: "pace" },
      { label: "Übliche Distanz", placeholder: "z.B. 10 km", key: "distance" },
    ],
    radfahren: [
      { label: "Tempo (km/h)", placeholder: "z.B. 25 km/h", key: "pace" },
      { label: "Übliche Distanz", placeholder: "z.B. 50 km", key: "distance" },
    ],
    fitness: [{ label: "Stärke/Fokus", placeholder: "z.B. Krafttraining, HIIT", key: "strength" }],
    fussball: [{ label: "Position/Stärke", placeholder: "z.B. Stürmer, Ausdauer", key: "strength" }],
    schwimmen: [
      { label: "Tempo (100m)", placeholder: "z.B. 1:45 min", key: "pace" },
      { label: "Übliche Distanz", placeholder: "z.B. 2 km", key: "distance" },
    ],
    yoga: [{ label: "Stil/Fokus", placeholder: "z.B. Vinyasa, Hatha", key: "strength" }],
    basketball: [{ label: "Position/Stärke", placeholder: "z.B. Point Guard", key: "strength" }],
    tennis: [{ label: "Spielstil", placeholder: "z.B. Grundlinie, Serve & Volley", key: "strength" }],
    handball: [{ label: "Position", placeholder: "z.B. Rückraum, Torwart", key: "strength" }],
    volleyball: [{ label: "Position", placeholder: "z.B. Zuspieler, Angreifer", key: "strength" }],
  };

  const handleSave = async () => {
    setSaving(true);

    // Build sportsStats
    const sportsStats: Record<string, SportStats> = {};
    for (const sp of sports) {
      const stat = getOrInitSportStat(sp);
      const entry: SportStats = { level: stat.level, frequency: stat.frequency || undefined };
      const fields = SPORT_STAT_FIELDS[sp] || [];
      for (const f of fields) {
        if (stat.values[f.key]) {
          (entry as any)[f.key] = stat.values[f.key];
        }
      }
      sportsStats[sp] = entry;
    }

    const firstSportStats = sportsStats[sports[0]] || { level: "anfaenger" as const };

    await updateProfile({
      displayName,
      bio,
      city,
      age: parseInt(age) || currentUser.age,
      sport: sports[0] || currentUser.sport,
      sports,
      sportStats: firstSportStats,
      sportsStats,
      avatar,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setActiveTab("profile");
      setSaved(false);
    }, 1000);
  };

  if (saved) {
    return (
      <div className="h-full flex flex-col bg-white items-center justify-center">
        <div className="text-5xl mb-4 animate-bounce">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Profil gespeichert!</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-white border-b border-gray-200">
        <button onClick={() => setActiveTab("profile")} className="text-gray-700 flex items-center gap-1.5">
          <ArrowLeft size={20} />
          <span className="text-sm">Zurück</span>
        </button>
        <h2 className="text-gray-900 font-bold">Profil bearbeiten</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-gray-700 flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          <Save size={14} />
          {saving ? "..." : "Speichern"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-24 px-4 pt-4 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img src={getAvatarUrl(currentUser.username)} alt={currentUser.username} className="w-20 h-20 rounded-full object-cover" />
          <p className="text-gray-500 text-[10px] mt-1.5">Automatisch generiert</p>
        </div>

        {/* Basic info */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">Anzeigename</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              placeholder="Erzähl was über dich..."
              className={INPUT_CLASS + " resize-none"}
            />
            <p className="text-gray-600 text-[10px] text-right mt-1">{bio.length}/150</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-500 text-xs mb-1.5 block">Alter</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div className="flex-1">
              <label className="text-gray-500 text-xs mb-1.5 block">Stadt</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={INPUT_CLASS} />
            </div>
          </div>
          <button
            onClick={detectLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 text-xs py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <MapPin size={13} />
            {locating ? "Wird ermittelt..." : "Standort aktualisieren"}
          </button>
        </div>

        {/* Sport */}
        <div>
          <label className="text-gray-500 text-xs mb-2 block">Sportarten <span className="text-gray-400">(mehrere möglich)</span></label>
          <div className="grid grid-cols-2 gap-2">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (sports.includes(s.id)) {
                    setSports(sports.filter((sp) => sp !== s.id));
                  } else {
                    setSports([...sports, s.id]);
                  }
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  sports.includes(s.id)
                    ? "border-gray-900 bg-gray-100 text-gray-900"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                <span className="text-base">{s.emoji}</span>
                <span className="text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </div>
          {sports.length > 0 && (
            <p className="text-gray-600 text-xs mt-2">{sports.length} Sportart{sports.length > 1 ? "en" : ""} ausgewählt</p>
          )}
        </div>

        {/* Per-Sport Stats */}
        <div className="space-y-4">
          <label className="text-gray-500 text-xs font-medium block">Stats pro Sportart</label>
          {sports.map((sportId) => {
            const sportInfo = SPORTS.find((s) => s.id === sportId);
            const stat = getOrInitSportStat(sportId);
            const fields = SPORT_STAT_FIELDS[sportId] || [];

            return (
              <div key={sportId} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sportInfo?.emoji}</span>
                  <h3 className="text-gray-900 font-semibold text-sm">{sportInfo?.label}</h3>
                </div>

                {/* Level */}
                <div>
                  <label className="text-gray-500 text-[11px] mb-1.5 block">Erfahrungsstufe</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: "anfaenger", label: "Anfänger", emoji: "🌱" },
                      { id: "fortgeschritten", label: "Fortgeschr.", emoji: "🔥" },
                      { id: "profi", label: "Profi", emoji: "🏆" },
                    ] as const).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => updateSportStat(sportId, "level", l.id)}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border transition-all ${
                          stat.level === l.id
                            ? "border-gray-900 bg-gray-100 text-gray-900"
                            : "border-gray-200 bg-white text-gray-500"
                        }`}
                      >
                        <span className="text-base">{l.emoji}</span>
                        <span className="text-[9px] font-medium">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="text-gray-500 text-[11px] mb-1.5 block">Wie oft?</label>
                  <div className="flex gap-1.5">
                    {["1x/Woche", "2-3x/Woche", "4-5x/Woche", "Täglich"].map((f) => (
                      <button
                        key={f}
                        onClick={() => updateSportStat(sportId, "frequency", f)}
                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-medium transition-all ${
                          stat.frequency === f
                            ? "bg-gray-100 text-gray-900 border border-gray-900"
                            : "bg-gray-100 text-gray-500 border border-transparent"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sport-specific fields */}
                {fields.length > 0 && (
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <div key={field.key}>
                        <label className="text-gray-500 text-[11px] mb-1 block">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={stat.values[field.key] || ""}
                          onChange={(e) => updateSportStatValue(sportId, field.key, e.target.value)}
                          className={INPUT_CLASS}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
