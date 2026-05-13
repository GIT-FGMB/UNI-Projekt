"use client";

import { LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Header() {
  const { currentUser, logout, setActiveTab } = useAppStore();

  return (
    <div className="gradient-header px-4 py-3 pt-12 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-gray-900 text-xl font-bold tracking-tight">SportsFreunde</h1>
      </div>
      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <button
              onClick={async () => {
                await logout();
                setActiveTab("feed");
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("login")}
            className="text-gray-700 text-sm font-semibold bg-gray-100 px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Anmelden
          </button>
        )}
      </div>
    </div>
  );
}
