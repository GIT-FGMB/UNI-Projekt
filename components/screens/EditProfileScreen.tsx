"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { SportStats } from "@/lib/store";
import { ArrowLeft, Save, MapPin, Camera } from "lucide-react";

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

const INPUT_CLASS = "w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all text-sm";

export default function EditProfileScreen() {
  const { currentUser, updateProfile, updateUserLocation, setActiveTab } = useAppStore();
  if (!currentUser) return null;

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [city, setCity] = useState(currentUser.city || "");
  const [age, setAge] = useState(String(currentUser.age || ""));
  const [sport, setSport] = useState(currentUser.sport);
  const [level, setLevel] = useState<SportStats["level"]>(currentUser.sportStats?.level || "anfaenger");
  const [frequency, setFrequency] = useState(currentUser.sportStats?.frequency || "");
  const [pace, setPace] = useState(currentUser.sportStats?.pace || "");
  const [distance, setDistance] = useState(currentUser.sportStats?.distance || "");
  const [strength, setStrength] = useState(currentUser.sportStats?.strength || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    const sportStats: Record<string, string> = { level };
    if (frequency) sportStats.frequency = frequency;
    if (pace) sportStats.pace = pace;
    if (distance) sportStats.distance = distance;
    if (strength) sportStats.strength = strength;

    await updateProfile({
      displayName,
      bio,
      city,
      age: parseInt(age) || currentUser.age,
      sport,
      sportStats: sportStats as unknown as SportStats,
      avatar,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setActiveTab("profile");
      setSaved(false);
    }, 1000);
  };

  const showPace = ["laufen", "radfahren", "schwimmen"].includes(sport);
  const showDistance = ["laufen", "radfahren", "schwimmen"].includes(sport);
  const showStrength = ["fitness", "fussball", "yoga", "basketball", "tennis", "handball", "volleyball"].includes(sport);

  if (saved) {
    return (
      <div className="h-full flex flex-col bg-gray-950 items-center justify-center">
        <div className="text-5xl mb-4 animate-bounce">✅</div>
        <h2 className="text-xl font-bold text-white">Profil gespeichert!</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 bg-gradient-to-r from-green-600 to-emerald-700">
        <button onClick={() => setActiveTab("profile")} className="text-white flex items-center gap-1.5">
          <ArrowLeft size={20} />
          <span className="text-sm">Zurück</span>
        </button>
        <h2 className="text-white font-bold">Profil bearbeiten</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-white flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          <Save size={14} />
          {saving ? "..." : "Speichern"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-24 px-4 pt-4 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="relative group"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-4xl">
              {avatar}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </button>
          <p className="text-gray-500 text-[10px] mt-1.5">Tippe zum Ändern</p>

          {showAvatarPicker && (
            <div className="mt-3 bg-gray-900 border border-gray-800 rounded-xl p-3 w-full animate-fade-in">
              <p className="text-gray-400 text-xs font-medium mb-2">Avatar wählen</p>
              <div className="grid grid-cols-7 gap-2">
                {["⚽","🏀","🎾","🏊","🏃","🚴","💪","🧘","🤾","🏐","🏅","🏆","⛷️","🤸","🧗","🏋️","🤺","🏄","🚣","🥊","🏇","😎","🦁","🐺","🦅","🔥","⚡","🌟"].map((e) => (
                  <button
                    key={e}
                    onClick={() => { setAvatar(e); setShowAvatarPicker(false); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      avatar === e ? "bg-green-500/20 ring-2 ring-green-500 scale-110" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic info */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Anzeigename</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Bio</label>
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
              <label className="text-gray-400 text-xs mb-1.5 block">Alter</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1.5 block">Stadt</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={INPUT_CLASS} />
            </div>
          </div>
          <button
            onClick={detectLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-300 text-xs py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <MapPin size={13} />
            {locating ? "Wird ermittelt..." : "Standort aktualisieren"}
          </button>
        </div>

        {/* Sport */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Sportart</label>
          <div className="grid grid-cols-2 gap-2">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSport(s.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  sport === s.id
                    ? "border-green-500 bg-green-500/10 text-white"
                    : "border-gray-800 bg-gray-900 text-gray-400"
                }`}
              >
                <span className="text-base">{s.emoji}</span>
                <span className="text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Level</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "anfaenger", label: "Anfänger", emoji: "🌱" },
              { id: "fortgeschritten", label: "Fortgeschr.", emoji: "🔥" },
              { id: "profi", label: "Profi", emoji: "🏆" },
            ] as const).map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${
                  level === l.id
                    ? "border-green-500 bg-green-500/10 text-white"
                    : "border-gray-800 bg-gray-900 text-gray-400"
                }`}
              >
                <span className="text-lg">{l.emoji}</span>
                <span className="text-[10px] font-medium">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-gray-400 text-xs mb-2 block">Trainingsfrequenz</label>
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
        <div className="space-y-3">
          <label className="text-gray-400 text-xs font-medium block">Sport-Stats</label>
          {showPace && (
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Tempo</label>
              <input type="text" value={pace} onChange={(e) => setPace(e.target.value)}
                placeholder={sport === "radfahren" ? "z.B. 25 km/h" : "z.B. 5:30 min/km"} className={INPUT_CLASS} />
            </div>
          )}
          {showDistance && (
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Übliche Distanz</label>
              <input type="text" value={distance} onChange={(e) => setDistance(e.target.value)}
                placeholder="z.B. 10 km" className={INPUT_CLASS} />
            </div>
          )}
          {showStrength && (
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Stärke/Fokus</label>
              <input type="text" value={strength} onChange={(e) => setStrength(e.target.value)}
                placeholder="z.B. Krafttraining, Stürmer" className={INPUT_CLASS} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
