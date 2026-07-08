"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import type { SportEvent, SportActivity } from "@/lib/store";
import ActivityCard from "@/components/ActivityCard";
import EventInfoCard from "@/components/EventInfoCard";
import Header from "@/components/Header";

type FeedItem =
  | { type: "activity"; data: SportActivity; at: number }
  | { type: "event"; data: SportEvent; at: number };

export default function FeedScreen() {
  const { events, activities, loading } = useAppStore();

  const feedItems = useMemo(() => {
    const items: FeedItem[] = [
      ...activities.map((a) => ({ type: "activity" as const, data: a, at: new Date(a.createdAt).getTime() })),
      ...events.map((e) => ({ type: "event" as const, data: e, at: new Date(e.createdAt).getTime() })),
    ];
    return items.sort((a, b) => b.at - a.at);
  }, [events, activities]);

  return (
    <div className="h-full flex flex-col bg-olive-700">
      <Header />
      <div className="flex-1 overflow-y-auto phone-scroll pb-24">
        {/* Mixed Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-4xl animate-bounce">🏅</div>
            <p className="text-olive-200 text-sm mt-3">Feed wird geladen...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-white font-semibold text-lg">Noch nichts hier</h3>
            <p className="text-olive-200 text-sm text-center mt-2">
              Poste deine erste Sporteinheit oder erstelle ein Event!
            </p>
          </div>
        ) : (
          feedItems.map((item) =>
            item.type === "activity" ? (
              <ActivityCard key={`a-${item.data.id}`} activity={item.data} />
            ) : (
              <EventInfoCard key={`e-${item.data.id}`} event={item.data} />
            )
          )
        )}
      </div>
    </div>
  );
}
