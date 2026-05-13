"use client";

import { useState, useEffect } from "react";
import { useAppStore, LEVEL_LABELS } from "@/lib/store";
import type { User } from "@/lib/store";
import { ArrowLeft, MapPin, Calendar, Zap, Users, MessageCircle } from "lucide-react";
import ActivityCard from "@/components/ActivityCard";
import { getAvatarUrl } from "@/lib/avatar";

export default function UserProfileScreen() {
  const { viewUserId, setActiveTab, fetchUserById, currentUser, followUser, unfollowUser, activities, openChat } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!viewUserId) return;
    setLoading(true);
    fetchUserById(viewUserId).then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, [viewUserId, fetchUserById]);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white items-center justify-center">
        <div className="text-4xl animate-bounce">🏅</div>
        <p className="text-gray-500 text-sm mt-3">Profil wird geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col bg-white items-center justify-center">
        <p className="text-gray-500">Benutzer nicht gefunden</p>
        <button onClick={() => setActiveTab("feed")} className="text-gray-700 mt-3 text-sm">Zurück zum Feed</button>
      </div>
    );
  }

  const isFollowing = (currentUser?.followingList || []).includes(user.id);
  const isOwnProfile = currentUser?.id === user.id;
  const userActivities = activities.filter((a) => a.userId === user.id);
  const stats = user.sportStats;

  const handleFollow = async () => {
    setFollowLoading(true);
    if (isFollowing) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }
    // Refresh user data
    const updated = await fetchUserById(user.id);
    if (updated) setUser(updated);
    setFollowLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-200">
        <button onClick={() => setActiveTab("feed")} className="text-gray-700">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-gray-900 font-bold flex-1">@{user.username}</h2>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-8">
        {/* Profile info */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-5">
            <img src={getAvatarUrl(user.username)} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-gray-900 font-bold text-lg">{user.eventsCount}</p>
                  <p className="text-gray-500 text-xs">Events</p>
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-lg">{user.followers}</p>
                  <p className="text-gray-500 text-xs">Follower</p>
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-lg">{user.following}</p>
                  <p className="text-gray-500 text-xs">Folge ich</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-gray-900 font-bold text-base">{user.displayName}</h3>
            <p className="text-gray-500 text-sm">@{user.username}</p>
            {user.bio && <p className="text-gray-600 text-sm mt-1">{user.bio}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {(user.sports || [user.sport]).map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize border border-gray-200">
                  {s}
                </span>
              ))}
              {user.age > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{user.age} Jahre</span>
              )}
              {user.city && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                  <MapPin size={10} /> {user.city}
                </span>
              )}
            </div>
          </div>

          {/* Per-Sport Stats */}
          {user.sportsStats && Object.keys(user.sportsStats).length > 0 ? (
            <div className="mt-4 space-y-2">
              {Object.entries(user.sportsStats).map(([sportId, sportStat]) => (
                <div key={sportId} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-gray-900 text-xs font-semibold mb-1.5 capitalize">{sportId}</p>
                  <div className="flex flex-wrap gap-2">
                    {sportStat.level && (
                      <div className="flex items-center gap-1">
                        <Zap size={11} className="text-gray-500" />
                        <span className="text-gray-700 text-[11px]">{LEVEL_LABELS[sportStat.level]}</span>
                      </div>
                    )}
                    {sportStat.frequency && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-gray-500" />
                        <span className="text-gray-700 text-[11px]">{sportStat.frequency}</span>
                      </div>
                    )}
                    {sportStat.pace && <span className="text-[11px] text-gray-500">⏱️ {sportStat.pace}</span>}
                    {sportStat.distance && <span className="text-[11px] text-gray-500">📏 {sportStat.distance}</span>}
                    {sportStat.strength && <span className="text-[11px] text-gray-500">💪 {sportStat.strength}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : stats && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-gray-500 text-xs font-medium mb-2">Stats</p>
              <div className="flex flex-wrap gap-3">
                {stats.level && (
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-gray-500" />
                    <span className="text-gray-700 text-xs">{LEVEL_LABELS[stats.level]}</span>
                  </div>
                )}
                {stats.frequency && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-500" />
                    <span className="text-gray-700 text-xs">{stats.frequency}</span>
                  </div>
                )}
                {stats.pace && <span className="text-xs text-gray-500">⏱️ {stats.pace}</span>}
                {stats.distance && <span className="text-xs text-gray-500">📏 {stats.distance}</span>}
                {stats.strength && <span className="text-xs text-gray-500">💪 {stats.strength}</span>}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isOwnProfile && currentUser && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`flex-1 font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${
                  isFollowing
                    ? "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-500"
                    : "bg-gray-900 text-white"
                }`}
              >
                <Users size={16} />
                {followLoading ? "..." : isFollowing ? "Entfolgen" : "Folgen"}
              </button>
              <button
                onClick={() => openChat(user.id)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <MessageCircle size={16} />
                Nachricht
              </button>
            </div>
          )}
        </div>

        {/* User activities */}
        <div className="border-t border-gray-200 pt-3">
          <p className="px-4 text-gray-500 text-xs font-medium mb-2">Aktivitäten</p>
          {userActivities.length > 0 ? (
            userActivities.map((a) => <ActivityCard key={a.id} activity={a} />)
          ) : (
            <div className="flex flex-col items-center py-10 px-8">
              <div className="text-4xl mb-3">🏃</div>
              <p className="text-gray-500 text-sm text-center">Noch keine Aktivitäten gepostet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
