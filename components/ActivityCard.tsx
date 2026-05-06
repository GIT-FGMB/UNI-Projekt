"use client";

import { useState } from "react";
import { Heart, MessageCircle, MapPin, Clock, Flame, Ruler, Timer, Send, Loader2 } from "lucide-react";
import { SportActivity, useAppStore } from "@/lib/store";
import type { Comment } from "@/lib/store";

const SPORT_EMOJI: Record<string, string> = {
  laufen: "🏃", radfahren: "🚴", fitness: "💪", schwimmen: "🏊",
  fussball: "⚽", basketball: "🏀", tennis: "🎾", yoga: "🧘",
  handball: "🤾", volleyball: "🏐",
};

export default function ActivityCard({ activity }: { activity: SportActivity }) {
  const { toggleActivityLike, addActivityComment, fetchActivityComments, currentUser, setActiveTab, setViewUser } = useAppStore();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [sending, setSending] = useState(false);

  const handleLike = async () => {
    if (!currentUser) { setActiveTab("login"); return; }
    await toggleActivityLike(activity.id);
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const fetched = await fetchActivityComments(activity.id);
      setComments(fetched);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!currentUser) { setActiveTab("login"); return; }
    if (!commentText.trim()) return;
    setSending(true);
    await addActivityComment(activity.id, commentText);
    setCommentText("");
    const fetched = await fetchActivityComments(activity.id);
    setComments(fetched);
    setSending(false);
  };

  const timeAgo = () => {
    const diff = Date.now() - new Date(activity.createdAt).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Gerade eben";
    if (hours < 24) return `vor ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `vor ${days}T`;
    return `vor ${Math.floor(days / 7)}W`;
  };

  const commentTimeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "jetzt";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}T`;
  };

  return (
    <div className="animate-fade-in mb-4">
      {/* User header - clickable */}
      <button
        onClick={() => setViewUser(activity.userId)}
        className="flex items-center gap-3 px-4 py-3 w-full text-left"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-lg">
          {activity.userAvatar}
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">{activity.username}</p>
          <p className="text-gray-500 text-xs">{timeAgo()}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-medium capitalize">
          {activity.sport}
        </span>
      </button>

      {/* Activity gradient card */}
      <div className={`w-full bg-gradient-to-br ${activity.image} relative p-5`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{SPORT_EMOJI[activity.sport] || "🏅"}</span>
          <h3 className="text-white text-lg font-bold drop-shadow-lg">{activity.title}</h3>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {activity.duration && (
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
              <Timer size={16} className="text-white/80" />
              <div>
                <p className="text-white/60 text-[10px]">Dauer</p>
                <p className="text-white font-semibold text-sm">{activity.duration}</p>
              </div>
            </div>
          )}
          {activity.distance && (
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
              <Ruler size={16} className="text-white/80" />
              <div>
                <p className="text-white/60 text-[10px]">Distanz</p>
                <p className="text-white font-semibold text-sm">{activity.distance}</p>
              </div>
            </div>
          )}
          {activity.pace && (
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
              <Clock size={16} className="text-white/80" />
              <div>
                <p className="text-white/60 text-[10px]">Tempo</p>
                <p className="text-white font-semibold text-sm">{activity.pace}</p>
              </div>
            </div>
          )}
          {activity.calories && (
            <div className="bg-black/25 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
              <Flame size={16} className="text-white/80" />
              <div>
                <p className="text-white/60 text-[10px]">Kalorien</p>
                <p className="text-white font-semibold text-sm">{activity.calories}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={handleLike} className="flex items-center gap-1.5 transition-all duration-200 active:scale-125">
          <Heart size={24} className={activity.liked ? "fill-red-500 text-red-500" : "text-white"} strokeWidth={activity.liked ? 0 : 1.5} />
        </button>
        <button onClick={handleToggleComments} className="flex items-center gap-1.5 transition-all duration-200 active:scale-110">
          <MessageCircle size={24} className={showComments ? "text-green-400" : "text-white"} strokeWidth={1.5} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4">
        <p className="text-white text-sm font-semibold">{activity.likes} Gefällt mir</p>
      </div>

      {/* Description */}
      {activity.description && (
        <div className="px-4 py-2">
          <p className="text-gray-300 text-sm">
            <span className="font-semibold text-white mr-1">{activity.username}</span>
            {activity.description}
          </p>
        </div>
      )}

      {/* Comments toggle */}
      {activity.comments > 0 && !showComments && (
        <button onClick={handleToggleComments} className="px-4 pb-3 text-gray-500 text-sm hover:text-gray-300 transition-colors text-left">
          Alle {activity.comments} Kommentare ansehen
        </button>
      )}

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-3 animate-fade-in">
          {loadingComments ? (
            <div className="flex items-center gap-2 py-3 text-gray-500 text-xs">
              <Loader2 size={14} className="animate-spin" /> Kommentare laden...
            </div>
          ) : (
            <>
              {comments.length > 0 ? (
                <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        {c.userAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-white font-semibold mr-1.5">{c.username}</span>
                          <span className="text-gray-300">{c.text}</span>
                        </p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{commentTimeAgo(c.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs py-2">Noch keine Kommentare. Schreib den ersten!</p>
              )}
              {currentUser ? (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-800/50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                    {currentUser.avatar}
                  </div>
                  <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Kommentar schreiben..." className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none" />
                  <button onClick={handleAddComment} disabled={!commentText.trim() || sending}
                    className={`transition-all ${commentText.trim() ? "text-green-400" : "text-gray-700"}`}>
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              ) : (
                <button onClick={() => setActiveTab("login")} className="text-green-400 text-xs font-medium pt-2">Anmelden zum Kommentieren</button>
              )}
            </>
          )}
        </div>
      )}

      <div className="h-px bg-gray-800/50 mx-4" />
    </div>
  );
}
