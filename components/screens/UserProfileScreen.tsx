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
      <div className="h-full flex flex-col bg-gray-950 items-center justify-center">
        <div className="text-4xl animate-bounce">🏅</div>
        <p className="text-gray-400 text-sm mt-3">Profil wird geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex flex-col bg-gray-950 items-center justify-center">
        <p className="text-gray-400">Benutzer nicht gefunden</p>
        <button onClick={() => setActiveTab("feed")} className="text-green-400 mt-3 text-sm">Zurück zum Feed</button>
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
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-gradient-to-r from-green-600 to-emerald-700">
        <button onClick={() => setActiveTab("feed")} className="text-white">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-white font-bold flex-1">@{user.username}</h2>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-8">
        {/* Profile info */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-5">
            <img src={getAvatarUrl(user.username)} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-white font-bold text-lg">{user.eventsCount}</p>
                  <p className="text-gray-400 text-xs">Events</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{user.followers}</p>
                  <p className="text-gray-400 text-xs">Follower</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{user.following}</p>
                  <p className="text-gray-400 text-xs">Folge ich</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-white font-bold text-base">{user.displayName}</h3>
            <p className="text-gray-400 text-sm">@{user.username}</p>
            {user.bio && <p className="text-gray-300 text-sm mt-1">{user.bio}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/15 text-green-400 font-medium capitalize">
                {user.sport}
              </span>
              {user.age > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">{user.age} Jahre</span>
              )}
              {user.city && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 flex items-center gap-1">
                  <MapPin size={10} /> {user.city}
                </span>
              )}
            </div>
          </div>

          {/* Sport Stats */}
          {stats && (
            <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-medium mb-2">Stats</p>
              <div className="flex flex-wrap gap-3">
                {stats.level && (
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-green-400" />
                    <span className="text-white text-xs">{LEVEL_LABELS[stats.level]}</span>
                  </div>
                )}
                {stats.frequency && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-green-400" />
                    <span className="text-white text-xs">{stats.frequency}</span>
                  </div>
                )}
                {stats.pace && <span className="text-xs text-gray-300">⏱️ {stats.pace}</span>}
                {stats.distance && <span className="text-xs text-gray-300">📏 {stats.distance}</span>}
                {stats.strength && <span className="text-xs text-gray-300">💪 {stats.strength}</span>}
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
                    ? "bg-gray-800 text-gray-300 hover:bg-red-500/15 hover:text-red-400"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                }`}
              >
                <Users size={16} />
                {followLoading ? "..." : isFollowing ? "Entfolgen" : "Folgen"}
              </button>
              <button
                onClick={() => openChat(user.id)}
                className="flex-1 bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <MessageCircle size={16} />
                Nachricht
              </button>
            </div>
          )}
        </div>

        {/* User activities */}
        <div className="border-t border-gray-800 pt-3">
          <p className="px-4 text-gray-400 text-xs font-medium mb-2">Aktivitäten</p>
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
