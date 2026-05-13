"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MapPin, Calendar, Clock, Send, Loader2 } from "lucide-react";
import { SportEvent, useAppStore } from "@/lib/store";
import type { Comment } from "@/lib/store";
import { getAvatarUrl } from "@/lib/avatar";

export default function EventCard({ event }: { event: SportEvent }) {
  const { toggleLike, addComment, fetchComments, currentUser, setActiveTab, setViewUser } = useAppStore();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [sending, setSending] = useState(false);

  const handleLike = async () => {
    if (!currentUser) { setActiveTab("login"); return; }
    await toggleLike(event.id);
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const fetched = await fetchComments(event.id);
      setComments(fetched);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!currentUser) { setActiveTab("login"); return; }
    if (!commentText.trim()) return;
    setSending(true);
    await addComment(event.id, commentText);
    setCommentText("");
    const fetched = await fetchComments(event.id);
    setComments(fetched);
    setSending(false);
  };

  const timeAgo = () => {
    const diff = Date.now() - new Date(event.createdAt).getTime();
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
    <div className="animate-fade-in mb-4 bg-white rounded-lg shadow-md">
      {/* User header - clickable */}
      <button onClick={() => setViewUser(event.userId)} className="flex items-center gap-3 px-4 py-3 w-full text-left">
        <img src={getAvatarUrl(event.username)} alt={event.username} className="w-9 h-9 rounded-full object-cover" />
        <div className="flex-1">
          <p className="text-gray-900 text-sm font-semibold">{event.username}</p>
          <p className="text-gray-400 text-xs">{timeAgo()}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium capitalize border border-blue-200">
          {event.sport}
        </span>
      </button>

      {/* Event image/gradient */}
      <div className="w-full aspect-[4/3] bg-blue-50 border-y border-blue-100 relative flex flex-col items-center justify-center">
        <span className="text-6xl mb-3">
          {event.sport === "fussball" ? "⚽" : event.sport === "fitness" ? "💪" : event.sport === "laufen" ? "🏃" : event.sport === "yoga" ? "🧘" : event.sport === "radfahren" ? "🚴" : "🏅"}
        </span>
        <h3 className="text-gray-900 text-lg font-bold text-center px-6">{event.title}</h3>
        <div className="flex items-center gap-4 mt-3 text-gray-500 text-xs">
          <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={handleLike} className="flex items-center gap-1.5 transition-all duration-200 active:scale-125">
          <Heart
            size={24}
            className={event.liked ? "fill-red-500 text-red-500" : "text-gray-600"}
            strokeWidth={event.liked ? 0 : 1.5}
          />
        </button>
        <button onClick={handleToggleComments} className="flex items-center gap-1.5 transition-all duration-200 active:scale-110">
          <MessageCircle size={24} className={showComments ? "text-blue-600" : "text-gray-600"} strokeWidth={1.5} />
        </button>
        <button className="flex items-center gap-1.5">
          <Share2 size={24} className="text-gray-600" strokeWidth={1.5} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4">
        <p className="text-gray-900 text-sm font-semibold">{event.likes} Gefällt mir</p>
      </div>

      {/* Description */}
      <div className="px-4 py-2">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-900 mr-1">{event.username}</span>
          {event.description}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 px-4 pb-2 text-gray-500 text-xs">
        <MapPin size={12} />
        <span>{event.location}</span>
      </div>

      {/* Comments link / toggle */}
      {event.comments > 0 && !showComments && (
        <button onClick={handleToggleComments} className="px-4 pb-3 text-gray-500 text-sm hover:text-gray-300 transition-colors text-left">
          Alle {event.comments} Kommentare ansehen
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
                      <img src={getAvatarUrl(c.username)} alt={c.username} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-gray-900 font-semibold mr-1.5">{c.username}</span>
                          <span className="text-gray-600">{c.text}</span>
                        </p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{commentTimeAgo(c.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs py-2">Noch keine Kommentare. Schreib den ersten!</p>
              )}

              {/* Comment input */}
              {currentUser ? (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <img src={getAvatarUrl(currentUser.username)} alt={currentUser.username} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Kommentar schreiben..."
                    className="flex-1 bg-transparent text-gray-900 text-sm placeholder-gray-400 outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || sending}
                    className={`transition-all ${commentText.trim() ? "text-blue-600" : "text-gray-300"}`}
                  >
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              ) : (
                <button onClick={() => setActiveTab("login")} className="text-green-400 text-xs font-medium pt-2">
                  Anmelden zum Kommentieren
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="h-px bg-gray-200 mx-4" />
    </div>
  );
}
