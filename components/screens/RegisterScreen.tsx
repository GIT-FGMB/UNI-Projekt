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

const INPUT_CLASS = "w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all text-sm";

export default function RegisterScreen() {
  const { register, setActiveTab } = useAppStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sport, setSport] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState<SportStats["level"]>("anfaenger");
  const [frequency, setFrequency] = useState("");
  const [statValues, setStatValues] = useState<Record<string, string>>({});
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

  const handleRegister = async () => {
    if (!email || !username || !password || !displayName || !sport || !age) {
      setError("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    setLoading(true);
    setError("");

    const sportStats: SportStats = {
      level,
      frequency: frequency || undefined,
    };
    const fields = SPORT_STAT_FIELDS[sport] || [];
    for (const f of fields) {
      if (statValues[f.key]) {
        (sportStats as any)[f.key] = statValues[f.key];
      }
    }

    const errorMsg = await register({
      email,
      password,
      displayName,
      username,
      sport,
      age: parseInt(age),
      city: city || "",
      latitude: coords?.lat || 0,
      longitude: coords?.lng || 0,
      sportStats,
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
    <div className="h-full flex flex-col bg-gray-950">
      {/* Back button */}
      <div className="pt-12 px-4">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : setActiveTab("login")}
          className="text-white flex items-center gap-2"
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
                s <= step ? "bg-green-500" : "bg-gray-800"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Konto erstellen</h2>
              <p className="text-gray-400 text-sm mt-1">Tritt der SportsFreunde Community bei!</p>
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
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/25"
            >
              Weiter
            </button>
          </div>
        )}

        {/* Step 2: Sport, Age, City */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Über dich</h2>
              <p className="text-gray-400 text-sm mt-1">Damit andere dich finden können</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-xs mb-1.5 block">Alter *</label>
                <input type="number" placeholder="z.B. 28" value={age}
                  onChange={(e) => setAge(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs mb-1.5 block">Stadt</label>
                <input type="text" placeholder="z.B. München" value={city}
                  onChange={(e) => setCity(e.target.value)} className={INPUT_CLASS} />
              </div>
            </div>

            <button
              onClick={detectLocation}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-300 text-sm py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
            >
              <MapPin size={14} />
              {locating ? "Wird ermittelt..." : coords ? "✓ Standort erkannt" : "Standort automatisch erkennen"}
            </button>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">Lieblingssportart *</label>
              <div className="grid grid-cols-2 gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSport(s.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      sport === s.id
                        ? "border-green-500 bg-green-500/10 text-white"
                        : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <span className="text-xs font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={() => {
                if (!sport || !age) { setError("Bitte Alter und Sportart angeben"); return; }
                setError(""); setStep(3);
              }}
              disabled={!sport || !age}
              className={`w-full font-semibold py-3.5 rounded-xl shadow-lg transition-all ${
                sport && age
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Weiter
            </button>
          </div>
        )}

        {/* Step 3: Sport Stats */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Dein Level</h2>
              <p className="text-gray-400 text-sm mt-1">Hilft dir passende Sportpartner zu finden</p>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">Erfahrungsstufe *</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "anfaenger", label: "Anfänger", emoji: "🌱" },
                  { id: "fortgeschritten", label: "Fortgeschr.", emoji: "🔥" },
                  { id: "profi", label: "Profi", emoji: "🏆" },
                ] as const).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      level === l.id
                        ? "border-green-500 bg-green-500/10 text-white"
                        : "border-gray-800 bg-gray-900 text-gray-400"
                    }`}
                  >
                    <span className="text-xl">{l.emoji}</span>
                    <span className="text-[11px] font-medium">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Wie oft trainierst du?</label>
              <div className="flex gap-2">
                {["1x/Woche", "2-3x/Woche", "4-5x/Woche", "Täglich"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-medium transition-all ${
                      frequency === f
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-800 text-gray-400 border border-transparent"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sport-specific stats */}
            {SPORT_STAT_FIELDS[sport] && (
              <div className="space-y-3">
                <label className="text-gray-400 text-xs font-medium block">Deine Stats ({SPORTS.find(s => s.id === sport)?.label})</label>
                {SPORT_STAT_FIELDS[sport].map((field) => (
                  <div key={field.key}>
                    <label className="text-gray-500 text-xs mb-1 block">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={statValues[field.key] || ""}
                      onChange={(e) => setStatValues({ ...statValues, [field.key]: e.target.value })}
                      className={INPUT_CLASS}
                    />
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full font-semibold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                !loading
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
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
