"use client";

import { useEffect } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import BottomNav from "@/components/BottomNav";
import FeedScreen from "@/components/screens/FeedScreen";
import LoginScreen from "@/components/screens/LoginScreen";
import RegisterScreen from "@/components/screens/RegisterScreen";
import CreateEventScreen from "@/components/screens/CreateEventScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import SearchScreen from "@/components/screens/SearchScreen";
import FindFriendsScreen from "@/components/screens/FindFriendsScreen";
import EventsScreen from "@/components/screens/EventsScreen";
import EditProfileScreen from "@/components/screens/EditProfileScreen";
import UserProfileScreen from "@/components/screens/UserProfileScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import InboxScreen from "@/components/screens/InboxScreen";
import EventDetailScreen from "@/components/screens/EventDetailScreen";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { activeTab, authLoading, currentUser, initAuth, initEvents, initActivities } = useAppStore();

  useEffect(() => {
    const unsubAuth = initAuth();
    return () => unsubAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubEvents = initEvents();
    return () => unsubEvents();
  }, [currentUser, initEvents]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubActivities = initActivities();
    return () => unsubActivities();
  }, [currentUser, initActivities]);

  if (authLoading) {
    return (
      <PhoneFrame>
        <div className="h-full flex flex-col items-center justify-center bg-gray-950">
          <div className="text-5xl mb-4 animate-bounce">🏅</div>
          <h1 className="text-xl font-bold text-white">SportsFreunde</h1>
          <p className="text-gray-400 text-sm mt-2">Wird geladen...</p>
        </div>
      </PhoneFrame>
    );
  }

  if (!currentUser && activeTab !== "login" && activeTab !== "register") {
    return (
      <PhoneFrame>
        <LoginScreen />
      </PhoneFrame>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "feed":
        return <FeedScreen />;
      case "search":
        return <SearchScreen />;
      case "friends":
        return <FindFriendsScreen />;
      case "create":
        return <CreateEventScreen />;
      case "events":
        return <EventsScreen />;
      case "profile":
        return <ProfileScreen />;
      case "login":
        return <LoginScreen />;
      case "register":
        return <RegisterScreen />;
      case "editprofile":
        return <EditProfileScreen />;
      case "userprofile":
        return <UserProfileScreen />;
      case "chat":
        return <ChatScreen />;
      case "inbox":
        return <InboxScreen />;
      case "eventdetail":
        return <EventDetailScreen />;
      default:
        return <FeedScreen />;
    }
  };

  const showNav = !["login", "register", "editprofile", "userprofile", "chat", "eventdetail"].includes(activeTab);

  return (
    <PhoneFrame>
      <div className="relative h-full">
        {renderScreen()}
        {showNav && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}
