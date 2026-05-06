"use client";

import { useState } from "react";
import { useAppStore, LEVEL_LABELS } from "@/lib/store";
import { Settings, Grid3X3, MapPin, Calendar, Zap, Clock, CalendarCheck, X } from "lucide-react";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";

export default function ProfileScreen() {
  const { currentUser, events, setActiveTab, toggleParticipation } = useAppStore();
  const [activeProfileTab, setActiveProfileTab] = useState<"events" | "participating">("events");

  if (!currentUser) return null;

  const userEvents = events.filter((e) => e.userId === currentUser.id);
  const participatingEvents = events.filter((e) => (e.participants || []).includes(currentUser.id));
  const stats = currentUser.sportStats;

  return (
    <div className="h-full flex flex-col bg-gray-950">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Profile header */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-4xl pulse-green">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-white font-bold text-lg">{currentUser.eventsCount}</p>
                  <p className="text-gray-400 text-xs">Events</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{currentUser.followers}</p>
                  <p className="text-gray-400 text-xs">Follower</p>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{currentUser.following}</p>
                  <p className="text-gray-400 text-xs">Folge ich</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-white font-bold text-base">{currentUser.displayName}</h3>
            <p className="text-gray-400 text-sm">@{currentUser.username}</p>
            {currentUser.bio && (
              <p className="text-gray-300 text-sm mt-1">{currentUser.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/15 text-green-400 font-medium capitalize">
                {currentUser.sport}
              </span>
              {currentUser.age > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                  {currentUser.age} Jahre
                </span>
              )}
              {currentUser.city && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 flex items-center gap-1">
                  <MapPin size={10} /> {currentUser.city}
                </span>
              )}
            </div>
          </div>

          {/* Sport Stats card */}
          {stats && (
            <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-medium mb-2">Meine Stats</p>
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
                {stats.pace && (
                  <span className="text-xs text-gray-300">⏱️ {stats.pace}</span>
                )}
                {stats.distance && (
                  <span className="text-xs text-gray-300">📏 {stats.distance}</span>
                )}
                {stats.strength && (
                  <span className="text-xs text-gray-300">💪 {stats.strength}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setActiveTab("editprofile")}
              className="flex-1 bg-gray-800 text-white font-semibold py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              Profil bearbeiten
            </button>
            <button className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-t border-gray-800">
          <button
            onClick={() => setActiveProfileTab("events")}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeProfileTab === "events" ? "border-white text-white" : "border-transparent text-gray-500"
            }`}
          >
            <Grid3X3 size={18} />
            <span className="text-xs font-medium">Meine Events</span>
          </button>
          <button
            onClick={() => setActiveProfileTab("participating")}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeProfileTab === "participating" ? "border-white text-white" : "border-transparent text-gray-500"
            }`}
          >
            <CalendarCheck size={18} />
            <span className="text-xs font-medium">Teilnahmen</span>
            {participatingEvents.length > 0 && (
              <span className="bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {participatingEvents.length}
              </span>
            )}
          </button>
        </div>

        {/* Meine Events tab */}
        {activeProfileTab === "events" && (
          userEvents.length > 0 ? (
            <div className="pt-2">
              {userEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-white font-semibold text-lg">Noch keine Events</h3>
              <p className="text-gray-400 text-sm text-center mt-2">
                Erstelle dein erstes Sport-Event und teile es mit der Community!
              </p>
            </div>
          )
        )}

        {/* Teilnahmen tab */}
        {activeProfileTab === "participating" && (
          participatingEvents.length > 0 ? (
            <div className="px-4 pt-3 space-y-3">
              {participatingEvents.map((event) => (
                <div key={event.id} className="gradient-card rounded-2xl border border-gray-800/50 overflow-hidden animate-fade-in">
                  <div className={`h-1 bg-gradient-to-r ${event.image}`} />
                  <div className="p-3.5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">von @{event.username}</p>
                      </div>
                      <button
                        onClick={async () => await toggleParticipation(event.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Teilnahme absagen"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2.5 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-green-400" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-green-400" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-green-400" />
                        {event.location}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-green-400 text-[11px] font-medium">
                      <CalendarCheck size={12} />
                      Du nimmst teil · {(event.participants || []).length} Teilnehmer
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-white font-semibold text-lg">Keine Teilnahmen</h3>
              <p className="text-gray-400 text-sm text-center mt-2">
                Geh zu Events und klicke auf "Teilnehmen" um dabei zu sein!
              </p>
              <button
                onClick={() => setActiveTab("events")}
                className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
              >
                Events entdecken
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
