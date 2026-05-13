import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-YRTXetoPBWjWoZfo22JDe_HBuu_l63A",
  authDomain: "app-sportsfreunde.firebaseapp.com",
  projectId: "app-sportsfreunde",
  storageBucket: "app-sportsfreunde.firebasestorage.app",
  messagingSenderId: "965845585032",
  appId: "1:965845585032:web:906ce5c5dcbcc27c07633d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const GRADIENTS = [
  "from-green-600 to-emerald-800",
  "from-blue-600 to-cyan-800",
  "from-purple-600 to-indigo-800",
  "from-orange-600 to-red-800",
  "from-teal-600 to-green-800",
  "from-pink-600 to-rose-800",
];

// ==================== 10 NEUE USER ====================
const NEW_USERS = [
  {
    email: "kevin.richter@test.de",
    password: "test123456",
    profile: {
      username: "kevin_sprint",
      displayName: "Kevin Richter",
      avatar: "🏃",
      bio: "Sprinter aus München. 100m in 11.2s 🏃‍♂️⚡",
      sport: "laufen",
      sports: ["laufen", "fitness"],
      age: 24,
      latitude: 48.1351,
      longitude: 11.5820,
      city: "München",
      sportStats: { level: "fortgeschritten", pace: "3:45 min/km", distance: "5 km", frequency: "4-5x/Woche" },
      sportsStats: {
        laufen: { level: "fortgeschritten", pace: "3:45 min/km", distance: "5 km", frequency: "4-5x/Woche" },
        fitness: { level: "anfaenger", strength: "Schnellkraft", frequency: "2-3x/Woche" },
      },
      followers: 234,
      following: 112,
      eventsCount: 0,
    },
  },
  {
    email: "julia.braun@test.de",
    password: "test123456",
    profile: {
      username: "julia_swim",
      displayName: "Julia Braun",
      avatar: "🏊",
      bio: "Schwimmerin seit der Kindheit. Kraul ist mein Ding! 🏊‍♀️",
      sport: "schwimmen",
      sports: ["schwimmen", "yoga"],
      age: 22,
      latitude: 48.3705,
      longitude: 10.8978,
      city: "Augsburg",
      sportStats: { level: "fortgeschritten", pace: "1:35 min/100m", distance: "4 km", frequency: "4-5x/Woche" },
      sportsStats: {
        schwimmen: { level: "fortgeschritten", pace: "1:35 min/100m", distance: "4 km", frequency: "4-5x/Woche" },
        yoga: { level: "anfaenger", strength: "Hatha", frequency: "1x/Woche" },
      },
      followers: 178,
      following: 93,
      eventsCount: 0,
    },
  },
  {
    email: "marco.koenig@test.de",
    password: "test123456",
    profile: {
      username: "marco_ball",
      displayName: "Marco König",
      avatar: "⚽",
      bio: "Torwart mit Reflexen! Jeden Sonntag auf dem Platz ⚽🧤",
      sport: "fussball",
      sports: ["fussball"],
      age: 29,
      latitude: 50.1109,
      longitude: 8.6821,
      city: "Frankfurt",
      sportStats: { level: "profi", strength: "Torwart, Reflextraining", frequency: "4-5x/Woche" },
      sportsStats: {
        fussball: { level: "profi", strength: "Torwart, Reflextraining", frequency: "4-5x/Woche" },
      },
      followers: 567,
      following: 203,
      eventsCount: 0,
    },
  },
  {
    email: "sophia.lang@test.de",
    password: "test123456",
    profile: {
      username: "sophia_zen",
      displayName: "Sophia Lang",
      avatar: "🧘",
      bio: "Yoga & Meditation. Inner peace is real power 🧘‍♀️✨",
      sport: "yoga",
      sports: ["yoga", "schwimmen"],
      age: 35,
      latitude: 52.5200,
      longitude: 13.4050,
      city: "Berlin",
      sportStats: { level: "profi", strength: "Ashtanga, Meditation", frequency: "Täglich" },
      sportsStats: {
        yoga: { level: "profi", strength: "Ashtanga, Meditation", frequency: "Täglich" },
        schwimmen: { level: "anfaenger", pace: "2:20 min/100m", frequency: "1x/Woche" },
      },
      followers: 1203,
      following: 340,
      eventsCount: 0,
    },
  },
  {
    email: "tim.huber@test.de",
    password: "test123456",
    profile: {
      username: "tim_mtb",
      displayName: "Tim Huber",
      avatar: "🚴",
      bio: "Mountainbiker aus den Alpen. Downhill ist Leben! 🚵‍♂️🏔️",
      sport: "radfahren",
      sports: ["radfahren", "fitness"],
      age: 27,
      latitude: 47.2692,
      longitude: 11.4041,
      city: "Innsbruck",
      sportStats: { level: "profi", pace: "22 km/h", distance: "60 km", frequency: "4-5x/Woche" },
      sportsStats: {
        radfahren: { level: "profi", pace: "22 km/h", distance: "60 km", frequency: "4-5x/Woche" },
        fitness: { level: "fortgeschritten", strength: "Beintraining, Core", frequency: "2-3x/Woche" },
      },
      followers: 445,
      following: 189,
      eventsCount: 0,
    },
  },
  {
    email: "lena.fuchs@test.de",
    password: "test123456",
    profile: {
      username: "lena_volley",
      displayName: "Lena Fuchs",
      avatar: "🏐",
      bio: "Volleyball ist Teamwork! Zuspielerin mit Herz 🏐💕",
      sport: "volleyball",
      sports: ["volleyball", "fitness"],
      age: 23,
      latitude: 53.5511,
      longitude: 9.9937,
      city: "Hamburg",
      sportStats: { level: "fortgeschritten", strength: "Zuspielerin, guter Aufschlag", frequency: "2-3x/Woche" },
      sportsStats: {
        volleyball: { level: "fortgeschritten", strength: "Zuspielerin, guter Aufschlag", frequency: "2-3x/Woche" },
        fitness: { level: "anfaenger", strength: "Cardio, Sprungkraft", frequency: "1x/Woche" },
      },
      followers: 156,
      following: 87,
      eventsCount: 0,
    },
  },
  {
    email: "paul.meier@test.de",
    password: "test123456",
    profile: {
      username: "paul_tennis",
      displayName: "Paul Meier",
      avatar: "🎾",
      bio: "Tennis-Nerd. Serve & Volley Style 🎾 Aufschlag bis 180km/h",
      sport: "tennis",
      sports: ["tennis"],
      age: 31,
      latitude: 51.2277,
      longitude: 6.7735,
      city: "Düsseldorf",
      sportStats: { level: "profi", strength: "Serve & Volley, starke Vorhand", frequency: "4-5x/Woche" },
      sportsStats: {
        tennis: { level: "profi", strength: "Serve & Volley, starke Vorhand", frequency: "4-5x/Woche" },
      },
      followers: 389,
      following: 145,
      eventsCount: 0,
    },
  },
  {
    email: "mia.wolf@test.de",
    password: "test123456",
    profile: {
      username: "mia_run",
      displayName: "Mia Wolf",
      avatar: "🏃",
      bio: "Ultraläuferin. 100km sind erst der Anfang 🏃‍♀️🌄",
      sport: "laufen",
      sports: ["laufen", "yoga"],
      age: 32,
      latitude: 50.9375,
      longitude: 6.9603,
      city: "Köln",
      sportStats: { level: "profi", pace: "5:10 min/km", distance: "100 km", frequency: "Täglich" },
      sportsStats: {
        laufen: { level: "profi", pace: "5:10 min/km", distance: "100 km", frequency: "Täglich" },
        yoga: { level: "fortgeschritten", strength: "Yin Yoga, Regeneration", frequency: "2-3x/Woche" },
      },
      followers: 892,
      following: 267,
      eventsCount: 0,
    },
  },
  {
    email: "nico.jung@test.de",
    password: "test123456",
    profile: {
      username: "nico_hoop",
      displayName: "Nico Jung",
      avatar: "🏀",
      bio: "Shooting Guard. 3-Pointer Maschine 🏀🎯",
      sport: "basketball",
      sports: ["basketball", "fitness"],
      age: 21,
      latitude: 48.7758,
      longitude: 9.1829,
      city: "Stuttgart",
      sportStats: { level: "fortgeschritten", strength: "Shooting Guard, Wurftechnik", frequency: "4-5x/Woche" },
      sportsStats: {
        basketball: { level: "fortgeschritten", strength: "Shooting Guard, Wurftechnik", frequency: "4-5x/Woche" },
        fitness: { level: "anfaenger", strength: "Sprungkraft, Agilität", frequency: "2-3x/Woche" },
      },
      followers: 201,
      following: 134,
      eventsCount: 0,
    },
  },
  {
    email: "clara.bauer@test.de",
    password: "test123456",
    profile: {
      username: "clara_fit",
      displayName: "Clara Bauer",
      avatar: "💪",
      bio: "Personal Trainerin. Calisthenics & Bodyweight 💪🔥",
      sport: "fitness",
      sports: ["fitness", "laufen"],
      age: 28,
      latitude: 48.4011,
      longitude: 9.9876,
      city: "Ulm",
      sportStats: { level: "profi", strength: "Calisthenics, Bodyweight", frequency: "Täglich" },
      sportsStats: {
        fitness: { level: "profi", strength: "Calisthenics, Bodyweight", frequency: "Täglich" },
        laufen: { level: "anfaenger", pace: "6:00 min/km", distance: "5 km", frequency: "1x/Woche" },
      },
      followers: 678,
      following: 210,
      eventsCount: 0,
    },
  },
];

// ==================== 10 NEUE EVENTS ====================
const NEW_EVENTS = [
  {
    userEmail: "kevin.richter@test.de",
    username: "kevin_sprint",
    userAvatar: "🏃",
    event: {
      title: "Sprint-Training im Olympiapark",
      description: "100m und 200m Intervalle auf der Tartanbahn. Aufwärmen ab 17:30, Training ab 18:00 ⚡🏃",
      sport: "laufen",
      location: "Olympiapark München",
      date: "2026-05-15",
      time: "18:00",
    },
  },
  {
    userEmail: "julia.braun@test.de",
    username: "julia_swim",
    userAvatar: "🏊",
    event: {
      title: "Schwimm-Technik Workshop",
      description: "Kraul-Technik verbessern mit Video-Analyse! Max. 8 Teilnehmer für individuelles Feedback 🏊‍♀️📹",
      sport: "schwimmen",
      location: "Hallenbad Augsburg",
      date: "2026-05-16",
      time: "19:00",
    },
  },
  {
    userEmail: "marco.koenig@test.de",
    username: "marco_ball",
    userAvatar: "⚽",
    event: {
      title: "Torwart-Training Special",
      description: "Offenes Torwart-Training für alle Level. Reflexe, Stellungsspiel, Abwürfe ⚽🧤",
      sport: "fussball",
      location: "Sportanlage Niederrad, Frankfurt",
      date: "2026-05-17",
      time: "10:00",
    },
  },
  {
    userEmail: "sophia.lang@test.de",
    username: "sophia_zen",
    userAvatar: "🧘",
    event: {
      title: "Sonnenaufgangs-Yoga am Brandenburger Tor",
      description: "Meditation & Ashtanga Flow bei Sonnenaufgang. Matte und warme Kleidung mitbringen 🧘‍♀️🌅",
      sport: "yoga",
      location: "Pariser Platz, Berlin",
      date: "2026-05-18",
      time: "05:30",
    },
  },
  {
    userEmail: "tim.huber@test.de",
    username: "tim_mtb",
    userAvatar: "🚴",
    event: {
      title: "MTB Enduro Tour – Nordkette",
      description: "Anspruchsvolle Enduro-Tour über die Nordkette. Nur für erfahrene Mountainbiker! 🚵‍♂️🏔️",
      sport: "radfahren",
      location: "Hungerburgbahn Talstation, Innsbruck",
      date: "2026-05-17",
      time: "08:00",
    },
  },
  {
    userEmail: "lena.fuchs@test.de",
    username: "lena_volley",
    userAvatar: "🏐",
    event: {
      title: "Mixed Volleyball Turnier",
      description: "6er Teams, gemischt. Anmeldung als Einzelspieler möglich – Teams werden gelost! 🏐🎲",
      sport: "volleyball",
      location: "Sporthalle Wandsbek, Hamburg",
      date: "2026-05-19",
      time: "14:00",
    },
  },
  {
    userEmail: "paul.meier@test.de",
    username: "paul_tennis",
    userAvatar: "🎾",
    event: {
      title: "Tennis Einzelturnier – Open Draw",
      description: "Turnier im K.O.-System. Alle Levels, separate Gruppen. Anmeldung bis 12.05. 🎾🏆",
      sport: "tennis",
      location: "Rochusclub Düsseldorf",
      date: "2026-05-20",
      time: "09:00",
    },
  },
  {
    userEmail: "mia.wolf@test.de",
    username: "mia_run",
    userAvatar: "🏃",
    event: {
      title: "Night Run Köln – 10km bei Nacht",
      description: "Laufen durch das beleuchtete Köln! Stirnlampe empfohlen. Tempo egal, Spaß zählt 🌙🏃‍♀️",
      sport: "laufen",
      location: "Rheinauhafen, Köln",
      date: "2026-05-16",
      time: "21:00",
    },
  },
  {
    userEmail: "nico.jung@test.de",
    username: "nico_hoop",
    userAvatar: "🏀",
    event: {
      title: "Basketball Skills Challenge",
      description: "Dribbeln, Werfen, Passen – teste deine Skills im Wettbewerb! Coole Preise 🏀🏅",
      sport: "basketball",
      location: "Streetball Court Bad Cannstatt, Stuttgart",
      date: "2026-05-18",
      time: "15:00",
    },
  },
  {
    userEmail: "clara.bauer@test.de",
    username: "clara_fit",
    userAvatar: "💪",
    event: {
      title: "Calisthenics Workshop für Einsteiger",
      description: "Muscle-Up, Handstand, Planche – die Basics lernen. Keine Vorkenntnisse nötig! 💪🤸",
      sport: "fitness",
      location: "Calisthenics Park Ulm",
      date: "2026-05-19",
      time: "11:00",
    },
  },
];

// ==================== 10 NEUE AKTIVITÄTEN ====================
const NEW_ACTIVITIES = [
  {
    userEmail: "kevin.richter@test.de",
    username: "kevin_sprint",
    userAvatar: "🏃",
    activity: {
      sport: "laufen",
      title: "200m Intervalle im Olympiapark",
      description: "8x200m mit 90s Pause. Beste Zeit heute: 24.8s! Wird langsam ⚡",
      duration: "45 min",
      distance: "3.2 km",
      pace: "3:30 min/km",
      calories: "380 kcal",
    },
  },
  {
    userEmail: "julia.braun@test.de",
    username: "julia_swim",
    userAvatar: "🏊",
    activity: {
      sport: "schwimmen",
      title: "Technik-Session Kraul",
      description: "Fokus auf Armzug und Wasserlage. Endlich fühlt sich der Catch besser an! 🏊‍♀️",
      duration: "50 min",
      distance: "2.0 km",
      pace: "1:38/100m",
      calories: "520 kcal",
    },
  },
  {
    userEmail: "marco.koenig@test.de",
    username: "marco_ball",
    userAvatar: "⚽",
    activity: {
      sport: "fussball",
      title: "Torwart-Training mit der U19",
      description: "30 Bälle gehalten, 5 durchgelassen. Die Reflexe werden schärfer! ⚽🧤",
      duration: "1h 20min",
      calories: "690 kcal",
    },
  },
  {
    userEmail: "sophia.lang@test.de",
    username: "sophia_zen",
    userAvatar: "🧘",
    activity: {
      sport: "yoga",
      title: "Ashtanga Primary Series",
      description: "Komplette Primary Series heute morgen. 90 Minuten purer Flow 🧘‍♀️🙏",
      duration: "90 min",
      calories: "310 kcal",
    },
  },
  {
    userEmail: "tim.huber@test.de",
    username: "tim_mtb",
    userAvatar: "🚴",
    activity: {
      sport: "radfahren",
      title: "Enduro-Trail Patscherkofel",
      description: "1200 Höhenmeter Downhill! Neue Bestzeit auf der Sektion 3 🚵‍♂️🏔️",
      duration: "2h 30min",
      distance: "35 km",
      pace: "14 km/h",
      calories: "1450 kcal",
    },
  },
  {
    userEmail: "lena.fuchs@test.de",
    username: "lena_volley",
    userAvatar: "🏐",
    activity: {
      sport: "volleyball",
      title: "Hallentraining mit dem Team",
      description: "Aufschlag-Drill und Spielformen. Mein Float-Aufschlag sitzt endlich! 🏐",
      duration: "1h 30min",
      calories: "620 kcal",
    },
  },
  {
    userEmail: "paul.meier@test.de",
    username: "paul_tennis",
    userAvatar: "🎾",
    activity: {
      sport: "tennis",
      title: "Aufschlagtraining – 200 Serves",
      description: "Fokus auf ersten Aufschlag. Quote heute: 68% rein, 4 Asse 🎾💥",
      duration: "1h 15min",
      calories: "480 kcal",
    },
  },
  {
    userEmail: "mia.wolf@test.de",
    username: "mia_run",
    userAvatar: "🏃",
    activity: {
      sport: "laufen",
      title: "Langer Lauf am Rhein",
      description: "30km easy pace am Rhein entlang. Perfektes Wetter, Beine fühlen sich gut an! 🏃‍♀️🌊",
      duration: "2h 35min",
      distance: "30 km",
      pace: "5:10 min/km",
      calories: "1850 kcal",
    },
  },
  {
    userEmail: "nico.jung@test.de",
    username: "nico_hoop",
    userAvatar: "🏀",
    activity: {
      sport: "basketball",
      title: "Wurf-Session – 100 Dreier",
      description: "100 3-Pointer geschossen, 47 getroffen. Quote steigt! 🏀🎯",
      duration: "1h 10min",
      calories: "520 kcal",
    },
  },
  {
    userEmail: "clara.bauer@test.de",
    username: "clara_fit",
    userAvatar: "💪",
    activity: {
      sport: "fitness",
      title: "Muscle-Up Progression",
      description: "Heute 5 saubere Muscle-Ups am Stück! Nächstes Ziel: 10 💪🤸",
      duration: "50 min",
      calories: "390 kcal",
    },
  },
];

// ==================== SEEDING ====================
async function seedAll() {
  // 1. Seed Users
  console.log("👤 Starte Seeding von", NEW_USERS.length, "neuen Usern...\n");
  const userUids = {};

  for (const userData of NEW_USERS) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      await setDoc(doc(db, "users", cred.user.uid), userData.profile);
      userUids[userData.email] = cred.user.uid;
      console.log(`✅ ${userData.profile.displayName} (@${userData.profile.username}) – ${userData.profile.city}`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`⏭️  ${userData.profile.displayName} existiert bereits, logge ein...`);
        try {
          const cred = await signInWithEmailAndPassword(auth, userData.email, userData.password);
          userUids[userData.email] = cred.user.uid;
        } catch (e) {
          console.log(`❌ Login fehlgeschlagen: ${e.message}`);
        }
      } else {
        console.log(`❌ ${userData.profile.displayName}: ${error.message}`);
      }
    }
  }

  // 2. Seed Events
  console.log("\n📅 Starte Seeding von", NEW_EVENTS.length, "neuen Events...\n");

  for (const item of NEW_EVENTS) {
    try {
      const cred = await signInWithEmailAndPassword(auth, item.userEmail, "test123456");

      const daysAhead = Math.floor(Math.random() * 14) + 1;
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toISOString();

      const eventDoc = {
        ...item.event,
        userId: cred.user.uid,
        username: item.username,
        userAvatar: item.userAvatar,
        image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        likes: Math.floor(Math.random() * 40) + 5,
        comments: Math.floor(Math.random() * 8),
        likedBy: [],
        participants: [],
        createdAt,
      };

      await addDoc(collection(db, "events"), eventDoc);
      await updateDoc(doc(db, "users", cred.user.uid), { eventsCount: increment(1) });

      console.log(`✅ "${item.event.title}" von @${item.username}`);
    } catch (error) {
      console.log(`❌ "${item.event.title}": ${error.message}`);
    }
  }

  // 3. Seed Activities
  console.log("\n🏋️ Starte Seeding von", NEW_ACTIVITIES.length, "neuen Aktivitäten...\n");

  for (const item of NEW_ACTIVITIES) {
    try {
      const cred = await signInWithEmailAndPassword(auth, item.userEmail, "test123456");

      const hoursAgo = Math.floor(Math.random() * 72) + 1;
      const createdAt = new Date(Date.now() - hoursAgo * 3600000).toISOString();

      await addDoc(collection(db, "activities"), {
        ...item.activity,
        userId: cred.user.uid,
        username: item.username,
        userAvatar: item.userAvatar,
        image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        likes: Math.floor(Math.random() * 50) + 3,
        comments: 0,
        likedBy: [],
        createdAt,
      });

      console.log(`✅ "${item.activity.title}" von @${item.username}`);
    } catch (error) {
      console.log(`❌ "${item.activity.title}": ${error.message}`);
    }
  }

  console.log("\n🎉 Seeding komplett abgeschlossen!");
  process.exit(0);
}

seedAll();
