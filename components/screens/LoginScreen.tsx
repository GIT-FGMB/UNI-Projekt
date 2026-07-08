"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginScreen() {
  const { login, setActiveTab } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }
    setLoading(true);
    setError("");
    const errorMsg = await login(email, password);
    setLoading(false);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setActiveTab("feed");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="text-6xl mb-3">🏅</div>
          <h1 className="text-3xl font-bold text-gray-900">SportsFreunde</h1>
          <p className="text-gray-500 text-sm mt-2">Dein Sport-Netzwerk</p>
        </div>

        {/* Form */}
        <div className="w-full space-y-4 animate-slide-up">
          <div>
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passwort"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 transition-all pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-olive-700 text-white font-semibold py-3.5 rounded-xl hover:bg-olive-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Wird angemeldet...</> : "Anmelden"}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">ODER</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => setActiveTab("register")}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            Neues Konto erstellen
          </button>
        </div>

        {/* Firebase hint */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 w-full">
          <p className="text-gray-500 text-xs text-center">
            � Anmeldung mit <span className="text-gray-700 font-medium">Firebase</span> — Registriere dich zuerst!
          </p>
        </div>
      </div>
    </div>
  );
}
