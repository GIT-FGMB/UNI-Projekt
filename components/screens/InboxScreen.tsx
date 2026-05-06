"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";

export default function InboxScreen() {
  const { chats, currentUser, initChats, openChat } = useAppStore();

  useEffect(() => {
    const unsub = initChats();
    return () => unsub();
  }, [initChats, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-white">Nachrichten</h2>
        </div>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-gray-600" />
            </div>
            <h3 className="text-white font-semibold text-lg">Noch keine Nachrichten</h3>
            <p className="text-gray-400 text-sm text-center mt-2">
              Geh auf ein Profil und schreib jemandem eine Nachricht!
            </p>
          </div>
        ) : (
          <div className="mt-2">
            {chats.map((chat) => {
              const otherId = chat.participants.find((p) => p !== currentUser.id) || "";
              const otherName = chat.participantNames?.[otherId] || "Unbekannt";
              const otherAvatar = chat.participantAvatars?.[otherId] || "🏅";
              const unreadCount = chat.unread?.[currentUser.id] || 0;

              const timeAgo = () => {
                if (!chat.lastMessageAt) return "";
                const diff = Date.now() - new Date(chat.lastMessageAt).getTime();
                const mins = Math.floor(diff / 60000);
                if (mins < 1) return "jetzt";
                if (mins < 60) return `${mins}m`;
                const hours = Math.floor(mins / 60);
                if (hours < 24) return `${hours}h`;
                return `${Math.floor(hours / 24)}T`;
              };

              return (
                <button
                  key={chat.id}
                  onClick={() => openChat(otherId)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-900/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl">
                      {otherAvatar}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${unreadCount > 0 ? "text-white" : "text-gray-300"}`}>
                        {otherName}
                      </p>
                      <span className="text-gray-500 text-[10px]">{timeAgo()}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${unreadCount > 0 ? "text-gray-300 font-medium" : "text-gray-500"}`}>
                      {chat.lastMessage || "Noch keine Nachricht"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
