import { create } from "zustand";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  increment,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface SportStats {
  level: "anfaenger" | "fortgeschritten" | "profi";
  pace?: string;
  distance?: string;
  frequency?: string;
  strength?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  sport: string;
  sports: string[];
  age: number;
  latitude: number;
  longitude: number;
  city: string;
  sportStats: SportStats;
  sportsStats: Record<string, SportStats>;
  followers: number;
  following: number;
  followingList: string[];
  eventsCount: number;
}

export interface SportEvent {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  description: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
  likedBy: string[];
  participants: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  lastMessage: string;
  lastMessageAt: string;
  unread: Record<string, number>;
}

export interface SportActivity {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  sport: string;
  title: string;
  description: string;
  duration: string;
  distance?: string;
  pace?: string;
  calories?: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
  likedBy: string[];
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  events: SportEvent[];
  activities: SportActivity[];
  nearbyUsers: User[];
  activeTab: string;
  viewUserId: string | null;
  viewEventId: string | null;
  chatUserId: string | null;
  previousTab: string | null;
  chats: Chat[];
  loading: boolean;
  authLoading: boolean;

  login: (email: string, password: string) => Promise<string | null>;
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  setViewUser: (userId: string) => void;
  setViewEvent: (eventId: string) => void;
  addEvent: (event: Omit<SportEvent, "id" | "userId" | "username" | "userAvatar" | "likes" | "comments" | "liked" | "likedBy" | "participants" | "createdAt">) => Promise<void>;
  toggleLike: (eventId: string) => Promise<void>;
  toggleParticipation: (eventId: string) => Promise<void>;
  addActivity: (data: Omit<SportActivity, "id" | "userId" | "username" | "userAvatar" | "likes" | "comments" | "liked" | "likedBy" | "createdAt">) => Promise<void>;
  toggleActivityLike: (activityId: string) => Promise<void>;
  addActivityComment: (activityId: string, text: string) => Promise<void>;
  fetchActivityComments: (activityId: string) => Promise<Comment[]>;
  initAuth: () => () => void;
  initEvents: () => () => void;
  initActivities: () => () => void;
  fetchNearbyUsers: () => Promise<void>;
  fetchUserById: (userId: string) => Promise<User | null>;
  updateUserLocation: (lat: number, lng: number, city: string) => Promise<void>;
  followUser: (targetUserId: string) => Promise<void>;
  unfollowUser: (targetUserId: string) => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "bio" | "displayName" | "city" | "age" | "sport" | "sports" | "sportStats" | "sportsStats" | "avatar">>) => Promise<void>;
  addComment: (eventId: string, text: string) => Promise<void>;
  fetchComments: (eventId: string) => Promise<Comment[]>;
  openChat: (targetUserId: string) => void;
  getOrCreateChat: (targetUserId: string) => Promise<string>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<ChatMessage[]>;
  subscribeMessages: (chatId: string, callback: (msgs: ChatMessage[]) => void) => () => void;
  initChats: () => () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  username: string;
  sport: string;
  sports: string[];
  age: number;
  city: string;
  latitude: number;
  longitude: number;
  sportStats: SportStats;
  sportsStats: Record<string, SportStats>;
}

const SPORT_AVATARS: Record<string, string> = {
  fussball: "⚽",
  basketball: "🏀",
  tennis: "🎾",
  schwimmen: "🏊",
  laufen: "🏃",
  radfahren: "🚴",
  volleyball: "🏐",
  handball: "🤾",
  fitness: "💪",
  yoga: "🧘",
};

const GRADIENT_COLORS = [
  "from-green-600 to-emerald-800",
  "from-blue-600 to-cyan-800",
  "from-purple-600 to-indigo-800",
  "from-orange-600 to-red-800",
  "from-teal-600 to-green-800",
  "from-pink-600 to-rose-800",
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const LEVEL_LABELS: Record<string, string> = {
  anfaenger: "Anfänger",
  fortgeschritten: "Fortgeschritten",
  profi: "Profi",
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  events: [],
  activities: [],
  nearbyUsers: [],
  activeTab: "feed",
  viewUserId: null,
  viewEventId: null,
  chatUserId: null,
  previousTab: null,
  chats: [],
  loading: true,
  authLoading: true,

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          set({ currentUser: { id: firebaseUser.uid, ...userDoc.data() } as User, authLoading: false });
        } else {
          set({ currentUser: null, authLoading: false, loading: false });
        }
      } else {
        set({ currentUser: null, authLoading: false, loading: false });
      }
    });
    return unsubscribe;
  },

  initEvents: () => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userId = get().currentUser?.id || "";
      const events: SportEvent[] = snapshot.docs.map((d) => {
        const data = d.data();
        const likedBy: string[] = data.likedBy || [];
        const participants: string[] = data.participants || [];
        return {
          id: d.id,
          ...data,
          likedBy,
          participants,
          liked: likedBy.includes(userId),
        } as SportEvent;
      });
      set({ events, loading: false });
    });
    return unsubscribe;
  },

  login: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: any) {
      const code = error?.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") return "Benutzer nicht gefunden oder falsches Passwort";
      if (code === "auth/wrong-password") return "Falsches Passwort";
      if (code === "auth/invalid-email") return "Ungültige E-Mail-Adresse";
      return error?.message || "Anmeldung fehlgeschlagen";
    }
  },

  register: async (data: RegisterData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      const userProfile: Omit<User, "id"> = {
        username: data.username,
        displayName: data.displayName,
        avatar: SPORT_AVATARS[data.sports[0] || data.sport] || "🏅",
        bio: "",
        sport: data.sports[0] || data.sport,
        sports: data.sports.length > 0 ? data.sports : [data.sport],
        age: data.age,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        sportStats: data.sportStats,
        sportsStats: data.sportsStats || {},
        followers: 0,
        following: 0,
        followingList: [],
        eventsCount: 0,
      };

      await setDoc(doc(db, "users", cred.user.uid), userProfile);
      set({ currentUser: { id: cred.user.uid, ...userProfile } });
      return null;
    } catch (error: any) {
      const code = error?.code || "";
      if (code === "auth/email-already-in-use") return "E-Mail wird bereits verwendet";
      if (code === "auth/weak-password") return "Passwort muss mindestens 6 Zeichen haben";
      if (code === "auth/invalid-email") return "Ungültige E-Mail-Adresse";
      return error?.message || "Registrierung fehlgeschlagen";
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ currentUser: null, activeTab: "feed" });
  },

  setActiveTab: (tab: string) => set({ activeTab: tab }),

  setViewUser: (userId: string) => {
    set((state) => ({ viewUserId: userId, previousTab: state.activeTab, activeTab: "userprofile" }));
  },

  setViewEvent: (eventId: string) => {
    set((state) => ({ viewEventId: eventId, previousTab: state.activeTab, activeTab: "eventdetail" }));
  },

  addEvent: async (eventData) => {
    const user = get().currentUser;
    if (!user) return;

    const newEvent = {
      ...eventData,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      likes: 0,
      comments: 0,
      likedBy: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "events"), newEvent);
    await updateDoc(doc(db, "users", user.id), { eventsCount: increment(1) });
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, eventsCount: state.currentUser.eventsCount + 1 }
        : null,
    }));
  },

  toggleLike: async (eventId: string) => {
    const user = get().currentUser;
    if (!user) return;

    const eventRef = doc(db, "events", eventId);
    const event = get().events.find((e) => e.id === eventId);
    if (!event) return;

    const isLiked = event.likedBy.includes(user.id);

    await updateDoc(eventRef, {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(user.id) : arrayUnion(user.id),
    });
  },

  toggleParticipation: async (eventId: string) => {
    const user = get().currentUser;
    if (!user) return;

    const eventRef = doc(db, "events", eventId);
    const event = get().events.find((e) => e.id === eventId);
    if (!event) return;

    const isParticipant = (event.participants || []).includes(user.id);

    await updateDoc(eventRef, {
      participants: isParticipant ? arrayRemove(user.id) : arrayUnion(user.id),
    });
  },

  fetchNearbyUsers: async () => {
    const user = get().currentUser;
    if (!user) return;

    const snapshot = await getDocs(collection(db, "users"));
    const users: User[] = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() } as User))
      .filter((u) => u.id !== user.id);
    set({ nearbyUsers: users });
  },

  updateUserLocation: async (lat: number, lng: number, city: string) => {
    const user = get().currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.id), {
      latitude: lat,
      longitude: lng,
      city,
    });
    set({ currentUser: { ...user, latitude: lat, longitude: lng, city } });
  },

  followUser: async (targetUserId: string) => {
    const user = get().currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.id), {
      following: increment(1),
      followingList: arrayUnion(targetUserId),
    });
    await updateDoc(doc(db, "users", targetUserId), {
      followers: increment(1),
    });
    set({
      currentUser: {
        ...user,
        following: user.following + 1,
        followingList: [...(user.followingList || []), targetUserId],
      },
    });
  },

  unfollowUser: async (targetUserId: string) => {
    const user = get().currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.id), {
      following: increment(-1),
      followingList: arrayRemove(targetUserId),
    });
    await updateDoc(doc(db, "users", targetUserId), {
      followers: increment(-1),
    });
    set({
      currentUser: {
        ...user,
        following: Math.max(0, user.following - 1),
        followingList: (user.followingList || []).filter((id) => id !== targetUserId),
      },
    });
  },

  updateProfile: async (data) => {
    const user = get().currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.id), data as Record<string, any>);
    set({ currentUser: { ...user, ...data } });
  },

  addComment: async (eventId: string, text: string) => {
    const user = get().currentUser;
    if (!user || !text.trim()) return;

    const commentData = {
      eventId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "events", eventId, "comments"), commentData);
    await updateDoc(doc(db, "events", eventId), { comments: increment(1) });
  },

  fetchComments: async (eventId: string) => {
    const q = query(
      collection(db, "events", eventId, "comments"),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
  },

  initActivities: () => {
    const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userId = get().currentUser?.id || "";
      const activities: SportActivity[] = snapshot.docs.map((d) => {
        const data = d.data();
        const likedBy: string[] = data.likedBy || [];
        return { id: d.id, ...data, likedBy, liked: likedBy.includes(userId) } as SportActivity;
      });
      set({ activities });
    });
    return unsubscribe;
  },

  addActivity: async (data) => {
    const user = get().currentUser;
    if (!user) return;

    const newActivity = {
      ...data,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      likes: 0,
      comments: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "activities"), newActivity);
  },

  toggleActivityLike: async (activityId: string) => {
    const user = get().currentUser;
    if (!user) return;
    const ref = doc(db, "activities", activityId);
    const activity = get().activities.find((a) => a.id === activityId);
    if (!activity) return;
    const isLiked = activity.likedBy.includes(user.id);
    await updateDoc(ref, {
      likes: increment(isLiked ? -1 : 1),
      likedBy: isLiked ? arrayRemove(user.id) : arrayUnion(user.id),
    });
  },

  addActivityComment: async (activityId: string, text: string) => {
    const user = get().currentUser;
    if (!user || !text.trim()) return;
    await addDoc(collection(db, "activities", activityId, "comments"), {
      eventId: activityId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, "activities", activityId), { comments: increment(1) });
  },

  fetchActivityComments: async (activityId: string) => {
    const q = query(collection(db, "activities", activityId, "comments"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
  },

  fetchUserById: async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as User;
  },

  openChat: (targetUserId: string) => {
    set((state) => ({ chatUserId: targetUserId, previousTab: state.activeTab, activeTab: "chat" }));
  },

  getOrCreateChat: async (targetUserId: string) => {
    const user = get().currentUser;
    if (!user) throw new Error("Not logged in");

    // Deterministic chat ID from sorted user IDs
    const chatId = [user.id, targetUserId].sort().join("_");
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      const targetUser = await get().fetchUserById(targetUserId);
      if (!targetUser) throw new Error("User not found");

      await setDoc(chatRef, {
        participants: [user.id, targetUserId],
        participantNames: {
          [user.id]: user.displayName,
          [targetUserId]: targetUser.displayName,
        },
        participantAvatars: {
          [user.id]: user.avatar,
          [targetUserId]: targetUser.avatar,
        },
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unread: { [user.id]: 0, [targetUserId]: 0 },
      });
    }
    return chatId;
  },

  sendMessage: async (chatId: string, text: string) => {
    const user = get().currentUser;
    if (!user || !text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: user.id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });

    // Get other participant to update unread
    const chatDoc = await getDoc(doc(db, "chats", chatId));
    const chatData = chatDoc.data();
    const otherId = chatData?.participants?.find((p: string) => p !== user.id) || "";

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: text.trim(),
      lastMessageAt: new Date().toISOString(),
      [`unread.${otherId}`]: increment(1),
    });
  },

  fetchMessages: async (chatId: string) => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
  },

  subscribeMessages: (chatId: string, callback: (msgs: ChatMessage[]) => void) => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
    });
  },

  initChats: () => {
    const user = get().currentUser;
    if (!user) return () => {};

    const q = query(collection(db, "chats"), where("participants", "array-contains", user.id));
    return onSnapshot(q, (snapshot) => {
      const chats: Chat[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Chat));
      chats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      set({ chats });
    });
  },
}));
