"use client";

import { Home, Users, PlusSquare, User, Trophy, MessageCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

const tabs = [
  { id: "feed", label: "Feed", icon: Home },
  { id: "friends", label: "Freunde", icon: Users },
  { id: "create", label: "Neu", icon: PlusSquare },
  { id: "inbox", label: "Chat", icon: MessageCircle },
  { id: "events", label: "Events", icon: Trophy },
  { id: "profile", label: "Profil", icon: User },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, currentUser, chats } = useAppStore();

  const totalUnread = currentUser
    ? chats.reduce((sum, c) => sum + (c.unread?.[currentUser.id] || 0), 0)
    : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-olive-800/95 backdrop-blur-lg border-t border-olive-600/30 pb-6 pt-2 z-30">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "create" || tab.id === "profile" || tab.id === "events" || tab.id === "friends" || tab.id === "inbox") {
                  if (!currentUser) {
                    setActiveTab("login");
                    return;
                  }
                }
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-200 ${
                isActive
                  ? "text-terra-400 scale-110"
                  : "text-olive-300 hover:text-white"
              }`}
            >
              {tab.id === "create" ? (
                <div className={`p-1.5 rounded-xl ${isActive ? "bg-olive-700" : ""}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
              ) : (
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                  {tab.id === "inbox" && totalUnread > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-terra-400 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {totalUnread}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
