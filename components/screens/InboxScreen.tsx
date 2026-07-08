"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import { getAvatarUrl } from "@/lib/avatar";

export default function InboxScreen() {
  const { chats, currentUser, initChats, openChat } = useAppStore();

  useEffect(() => {
    const unsub = initChats();
    return () => unsub();
  }, [initChats, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="h-full flex flex-col bg-olive-700">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-white">Nachrichten</h2>
        </div>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-16 h-16 rounded-full bg-olive-600 flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-olive-300" />
            </div>
            <h3 className="text-white font-semibold text-lg">Noch keine Nachrichten</h3>
            <p className="text-olive-300 text-sm text-center mt-2">
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
                  className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-olive-600 transition-colors"
                >
                  <div className="relative">
                    <img src={getAvatarUrl(otherName)} alt={otherName} className="w-12 h-12 rounded-full object-cover" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terra-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${unreadCount > 0 ? "text-white" : "text-olive-200"}`}>
                        {otherName}
                      </p>
                      <span className="text-olive-400 text-[10px]">{timeAgo()}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${unreadCount > 0 ? "text-olive-200 font-medium" : "text-olive-400"}`}>
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
