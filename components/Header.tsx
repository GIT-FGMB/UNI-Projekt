"use client";

import { LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Header() {
  const { currentUser, logout, setActiveTab } = useAppStore();

  return (
    <div className="gradient-header px-4 py-3 pt-12 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-white text-xl font-bold tracking-tight">SportsFreunde</h1>
      </div>
      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <button
              onClick={async () => {
                await logout();
                setActiveTab("feed");
              }}
              className="text-white/80 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("login")}
            className="text-white text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-full hover:bg-white/30 transition-colors"
          >
            Anmelden
          </button>
        )}
      </div>
    </div>
  );
}
