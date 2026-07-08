"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import type { ChatMessage } from "@/lib/store";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAvatarUrl } from "@/lib/avatar";

export default function ChatScreen() {
  const { chatUserId, currentUser, setActiveTab, getOrCreateChat, sendMessage, subscribeMessages, fetchUserById } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerAvatar, setPartnerAvatar] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatUserId || !currentUser) return;

    let unsubMessages: (() => void) | null = null;

    const init = async () => {
      const partner = await fetchUserById(chatUserId);
      if (partner) {
        setPartnerName(partner.displayName);
        setPartnerAvatar(partner.avatar);
      }

      const id = await getOrCreateChat(chatUserId);
      setChatId(id);

      // Clear unread
      await updateDoc(doc(db, "chats", id), { [`unread.${currentUser.id}`]: 0 });

      unsubMessages = subscribeMessages(id, (msgs) => {
        setMessages(msgs);
        setLoading(false);
      });
    };

    init();
    return () => { if (unsubMessages) unsubMessages(); };
  }, [chatUserId, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!chatId || !text.trim()) return;
    setSending(true);
    await sendMessage(chatId, text);
    setText("");
    setSending(false);
  };

  const goBack = () => {
    const prev = useAppStore.getState().previousTab;
    setActiveTab(prev || "inbox");
  };

  const formatTime = (createdAt: string) => {
    const d = new Date(createdAt);
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateSeparator = (createdAt: string) => {
    const d = new Date(createdAt);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Heute";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Gestern";
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const dateStr = new Date(msg.createdAt).toDateString();
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateStr) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateStr, messages: [msg] });
    }
  });

  return (
    <div className="h-full flex flex-col bg-olive-700">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-olive-800 border-b border-olive-600">
        <button onClick={goBack} className="text-olive-300">
          <ArrowLeft size={22} />
        </button>
        <img src={getAvatarUrl(partnerName)} alt={partnerName} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{partnerName || "..."}</p>
          <p className="text-olive-300 text-[10px]">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto phone-scroll px-4 py-3 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="text-gray-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-gray-500 text-sm text-center">Schreib die erste Nachricht!</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="flex justify-center my-3">
                <span className="text-[10px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {formatDateSeparator(group.messages[0].createdAt)}
                </span>
              </div>
              {group.messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1.5`}>
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl ${
                        isMine
                          ? "bg-terra-400 text-white rounded-br-md"
                          : "bg-olive-600 text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-[9px] mt-0.5 ${isMine ? "text-terra-200" : "text-olive-400"} text-right`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-olive-800 border-t border-olive-600">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nachricht schreiben..."
            className="flex-1 bg-olive-600 text-white text-sm px-4 py-2.5 rounded-full placeholder-olive-400 outline-none focus:ring-1 focus:ring-olive-500"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              text.trim() ? "bg-terra-400 text-white" : "bg-olive-600 text-olive-400"
            }`}
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
