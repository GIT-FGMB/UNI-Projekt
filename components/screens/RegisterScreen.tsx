"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { SportStats } from "@/lib/store";
import { ArrowLeft, MapPin } from "lucide-react";

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

const SPORT_STAT_FIELDS: Record<string, { label: string; placeholder: string; key: keyof SportStats }[]> = {
  laufen: [
    { label: "Tempo (min/km)", placeholder: "z.B. 5:30", key: "pace" },
    { label: "Übliche Distanz", placeholder: "z.B. 10 km", key: "distance" },
  ],
  radfahren: [
    { label: "Tempo (km/h)", placeholder: "z.B. 25 km/h", key: "pace" },
    { label: "Übliche Distanz", placeholder: "z.B. 50 km", key: "distance" },
  ],
  fitness: [
    { label: "Stärke/Fokus", placeholder: "z.B. Krafttraining, HIIT", key: "strength" },
  ],
  fussball: [
    { label: "Position/Stärke", placeholder: "z.B. Stürmer, Ausdauer", key: "strength" },
  ],
  schwimmen: [
    { label: "Tempo (100m)", placeholder: "z.B. 1:45 min", key: "pace" },
    { label: "Übliche Distanz", placeholder: "z.B. 2 km", key: "distance" },
  ],
  yoga: [
    { label: "Stil/Fokus", placeholder: "z.B. Vinyasa, Hatha", key: "strength" },
  ],
};

const INPUT_CLASS = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all text-sm";

export default function RegisterScreen() {
  const { register, setActiveTab } = useAppStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sports, setSports] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [perSportStats, setPerSportStats] = useState<Record<string, { level: SportStats["level"]; frequency: string; values: Record<string, string> }>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  const handleRegister = async () => {
    if (!email || !username || !password || !displayName || sports.length === 0 || !age) {
      setError("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    setLoading(true);
    setError("");

    // Build per-sport stats
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

    // Use first sport's stats as the legacy sportStats
    const firstSportStats = sportsStats[sports[0]] || { level: "anfaenger" as const };

    const errorMsg = await register({
      email,
      password,
      displayName,
      username,
      sport: sports[0],
      sports,
      age: parseInt(age),
      city: city || "",
      latitude: coords?.lat || 0,
      longitude: coords?.lng || 0,
      sportStats: firstSportStats,
      sportsStats,
    });
    setLoading(false);
    if (errorMsg) {
      setError(errorMsg);
      if (errorMsg.includes("E-Mail")) setStep(1);
    } else {
      setActiveTab("feed");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Back button */}
      <div className="pt-12 px-4">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : setActiveTab("login")}
          className="text-gray-700 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Zurück</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col px-8 pt-4 overflow-y-auto phone-scroll pb-8">
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${
                s <= step ? "bg-gray-900" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Konto erstellen</h2>
              <p className="text-gray-500 text-sm mt-1">Tritt der SportsFreunde Community bei!</p>
            </div>

            <input type="text" placeholder="Anzeigename" value={displayName}
              onChange={(e) => setDisplayName(e.target.value)} className={INPUT_CLASS} />
            <input type="text" placeholder="Benutzername" value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))} className={INPUT_CLASS} />
            <input type="email" placeholder="E-Mail-Adresse" value={email}
              onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASS} />
            <input type="password" placeholder="Passwort (mind. 6 Zeichen)" value={password}
              onChange={(e) => setPassword(e.target.value)} className={INPUT_CLASS} />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={() => {
                if (!displayName || !username || !email || !password) {
                  setError("Bitte alle Felder ausfüllen"); return;
                }
                if (password.length < 6) {
                  setError("Passwort muss mindestens 6 Zeichen haben"); return;
                }
                setError(""); setStep(2);
              }}
              className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl"
            >
              Weiter
            </button>
          </div>
        )}

        {/* Step 2: Sport, Age, City */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Über dich</h2>
              <p className="text-gray-500 text-sm mt-1">Damit andere dich finden können</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-500 text-xs mb-1.5 block">Alter *</label>
                <input type="number" placeholder="z.B. 28" value={age}
                  onChange={(e) => setAge(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div className="flex-1">
                <label className="text-gray-500 text-xs mb-1.5 block">Stadt</label>
                <input type="text" placeholder="z.B. München" value={city}
                  onChange={(e) => setCity(e.target.value)} className={INPUT_CLASS} />
              </div>
            </div>

            <button
              onClick={detectLocation}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <MapPin size={14} />
              {locating ? "Wird ermittelt..." : coords ? "✓ Standort erkannt" : "Standort automatisch erkennen"}
            </button>

            <div>
              <label className="text-gray-500 text-xs mb-2 block">Sportarten * <span className="text-gray-400">(mehrere möglich)</span></label>
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
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      sports.includes(s.id)
                        ? "border-gray-900 bg-gray-100 text-gray-900"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <span className="text-xs font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
              {sports.length > 0 && (
                <p className="text-gray-600 text-xs mt-2">{sports.length} Sportart{sports.length > 1 ? "en" : ""} ausgewählt</p>
              )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={() => {
                if (sports.length === 0 || !age) { setError("Bitte Alter und mindestens eine Sportart angeben"); return; }
                setError(""); setStep(3);
              }}
              disabled={sports.length === 0 || !age}
              className={`w-full font-semibold py-3.5 rounded-xl transition-all ${
                sports.length > 0 && age
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Weiter
            </button>
          </div>
        )}

        {/* Step 3: Sport Stats - per sport */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Deine Level</h2>
              <p className="text-gray-500 text-sm mt-1">Bewerte dich pro Sportart – hilft dir passende Partner zu finden</p>
            </div>

            {sports.map((sportId) => {
              const sportInfo = SPORTS.find((s) => s.id === sportId);
              const stat = getOrInitSportStat(sportId);
              const fields = SPORT_STAT_FIELDS[sportId] || [];

              return (
                <div key={sportId} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sportInfo?.emoji}</span>
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

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                !loading
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Wird erstellt..." : "Konto erstellen 🎉"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
