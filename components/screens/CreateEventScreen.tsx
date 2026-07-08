"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { MapPin, Calendar, Clock, ChevronDown, Dumbbell, CalendarPlus, X, ImagePlus } from "lucide-react";

const SPORT_OPTIONS = [
  { id: "fussball", label: "Fußball", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "schwimmen", label: "Schwimmen", emoji: "🏊" },
  { id: "laufen", label: "Laufen", emoji: "🏃" },
  { id: "radfahren", label: "Radfahren", emoji: "🚴" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
];

const GRADIENTS = [
  "from-green-600 to-emerald-800",
  "from-blue-600 to-cyan-800",
  "from-purple-600 to-indigo-800",
  "from-orange-600 to-red-800",
  "from-teal-600 to-green-800",
  "from-pink-600 to-rose-800",
];

const INPUT_CLASS = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all text-sm";

export default function CreateEventScreen() {
  const { addEvent, addActivity, setActiveTab } = useAppStore();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"activity" | "event">("activity");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("");
  const [calories, setCalories] = useState("");
  const [showSports, setShowSports] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateEvent = async () => {
    if (!title || !description || !sport || !location || !date || !time) return;
    await addEvent({ title, description, sport, location, date, time, image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)] });
    setSuccessMsg("Event erstellt!");
    setSuccess(true);
    setTimeout(() => { setActiveTab("feed"); setSuccess(false); }, 1500);
  };

  const handleCreateActivity = async () => {
    if (!title || !sport || !duration) return;
    await addActivity({
      title, description, sport, duration,
      distance: distance || undefined,
      pace: pace || undefined,
      calories: calories || undefined,
      image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    });
    setSuccessMsg("Aktivität gepostet!");
    setSuccess(true);
    setTimeout(() => { setActiveTab("feed"); setSuccess(false); }, 1500);
  };

  if (success) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-gray-200">
          <div className="w-16" />
          <h2 className="text-gray-900 font-bold text-base">Geschafft!</h2>
          <div className="w-16" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">{successMsg}</h2>
          <p className="text-gray-500 mt-2">Ist jetzt im Feed sichtbar.</p>
        </div>
      </div>
    );
  }

  const selectedSport = SPORT_OPTIONS.find((s) => s.id === sport);

  const canSubmit = mode === "activity"
    ? !!(title && sport && duration)
    : !!(title && description && sport && location && date && time);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Custom header: X / Neu erstellen / Weiter */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-gray-200">
        <button onClick={() => setActiveTab("feed")} className="text-gray-400 hover:text-gray-700 transition-colors">
          <X size={22} />
        </button>
        <h2 className="text-gray-900 font-bold text-base">Neu erstellen</h2>
        <button
          onClick={mode === "activity" ? handleCreateActivity : handleCreateEvent}
          disabled={!canSubmit}
          className={`text-sm font-semibold transition-colors ${
            canSubmit ? "text-gray-900 font-bold" : "text-gray-300 cursor-not-allowed"
          }`}
        >
          Weiter
        </button>
      </div>
      <div className="flex-1 overflow-y-auto phone-scroll pb-24 px-4 pt-4">
        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          <button
            onClick={() => setMode("activity")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "activity" ? "bg-olive-700 text-white" : "text-gray-500"
            }`}
          >
            <Dumbbell size={16} /> Aktivität
          </button>
          <button
            onClick={() => setMode("event")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "event" ? "bg-olive-700 text-white" : "text-gray-500"
            }`}
          >
            <CalendarPlus size={16} /> Event
          </button>
        </div>

        {/* Photo upload placeholder */}
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPhotoPreview(url);
              }
            };
            input.click();
          }}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors mb-5 overflow-hidden"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Vorschau" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <>
              <ImagePlus size={28} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Foto hinzufügen</span>
            </>
          )}
        </button>

        <div className="space-y-3">
          <input type="text" placeholder={mode === "activity" ? "z.B. Morgenlauf im Park" : "Event-Titel"}
            value={title} onChange={(e) => setTitle(e.target.value)} className={INPUT_CLASS} />

          <textarea placeholder="Beschreibung (optional)..." value={description}
            onChange={(e) => setDescription(e.target.value)} rows={2} className={INPUT_CLASS + " resize-none"} />

          {/* Sport selector */}
          <div className="relative">
            <button onClick={() => setShowSports(!showSports)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left flex items-center justify-between">
              {selectedSport ? (
                <span className="text-gray-900 flex items-center gap-2 text-sm">
                  <span>{selectedSport.emoji}</span> {selectedSport.label}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Sportart wählen</span>
              )}
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showSports && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden z-20 max-h-48 overflow-y-auto shadow-lg">
                {SPORT_OPTIONS.map((s) => (
                  <button key={s.id} onClick={() => { setSport(s.id); setShowSports(false); }}
                    className="w-full px-4 py-2.5 text-left text-gray-900 hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <span>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Activity-specific fields */}
          {mode === "activity" && (
            <>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-500 text-xs mb-1 block">Dauer *</label>
                  <input type="text" placeholder="z.B. 45 min" value={duration}
                    onChange={(e) => setDuration(e.target.value)} className={INPUT_CLASS} />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 text-xs mb-1 block">Distanz</label>
                  <input type="text" placeholder="z.B. 8.5 km" value={distance}
                    onChange={(e) => setDistance(e.target.value)} className={INPUT_CLASS} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-500 text-xs mb-1 block">Tempo</label>
                  <input type="text" placeholder="z.B. 5:30/km" value={pace}
                    onChange={(e) => setPace(e.target.value)} className={INPUT_CLASS} />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 text-xs mb-1 block">Kalorien</label>
                  <input type="text" placeholder="z.B. 420 kcal" value={calories}
                    onChange={(e) => setCalories(e.target.value)} className={INPUT_CLASS} />
                </div>
              </div>
            </>
          )}

          {/* Event-specific fields */}
          {mode === "event" && (
            <>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Ort" value={location}
                  onChange={(e) => setLocation(e.target.value)} className="bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none flex-1 text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-gray-900 focus:outline-none flex-1 text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <Clock size={16} className="text-gray-400 flex-shrink-0" />
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                    className="bg-transparent text-gray-900 focus:outline-none flex-1 text-sm" />
                </div>
              </div>
            </>
          )}

          <button
            onClick={mode === "activity" ? handleCreateActivity : handleCreateEvent}
            disabled={!canSubmit}
            className={`w-full font-semibold py-3.5 rounded-xl mt-2 transition-all ${
              canSubmit
                ? `bg-terra-400 text-white active:scale-[0.98]`
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {mode === "activity" ? "Aktivität posten" : "Event veröffentlichen"}
          </button>
        </div>
      </div>
    </div>
  );
}
