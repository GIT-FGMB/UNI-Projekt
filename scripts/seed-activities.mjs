import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const ACTIVITIES = [
  {
    userEmail: "sarah.wagner@test.de",
    username: "sarah_runs",
    userAvatar: "🏃",
    activity: {
      sport: "laufen",
      title: "Morgenlauf durch den Hardtwald",
      description: "Perfekter Start in den Tag! 🌅 Endlich wieder unter 5er Schnitt.",
      duration: "48 min",
      distance: "10.2 km",
      pace: "4:42 min/km",
      calories: "620 kcal",
    },
  },
  {
    userEmail: "felix.hoffmann@test.de",
    username: "felix_bike",
    userAvatar: "🚴",
    activity: {
      sport: "radfahren",
      title: "Feierabendrunde Neckartal",
      description: "Schöne Tour entlang des Neckars bei Sonnenuntergang 🌇",
      duration: "1h 45min",
      distance: "52 km",
      pace: "29.7 km/h",
      calories: "980 kcal",
    },
  },
  {
    userEmail: "jan.becker@test.de",
    username: "jan_power",
    userAvatar: "💪",
    activity: {
      sport: "fitness",
      title: "Push Day – Brust & Schultern",
      description: "Neuer PR auf der Bankdrücke! 100kg geschafft 💪🔥",
      duration: "1h 15min",
      calories: "540 kcal",
    },
  },
  {
    userEmail: "emma.schneider@test.de",
    username: "emma_yoga",
    userAvatar: "🧘",
    activity: {
      sport: "yoga",
      title: "Morgen-Vinyasa am Fluss",
      description: "60 Minuten Flow am Dreisam-Ufer. Namaste 🙏",
      duration: "60 min",
      calories: "220 kcal",
    },
  },
  {
    userEmail: "nina.fischer@test.de",
    username: "nina_splash",
    userAvatar: "🏊",
    activity: {
      sport: "schwimmen",
      title: "Freiwasser-Training Bodensee",
      description: "Heute war das Wasser richtig klar! Super Sicht. 🌊",
      duration: "55 min",
      distance: "2.4 km",
      pace: "2:05/100m",
      calories: "580 kcal",
    },
  },
  {
    userEmail: "marie.weber@test.de",
    username: "marie_laeuft",
    userAvatar: "🏃",
    activity: {
      sport: "laufen",
      title: "Trail Run Schwäbische Alb",
      description: "Matschig aber geil! 😂 Die Aussicht oben war den Anstieg wert.",
      duration: "1h 32min",
      distance: "12.5 km",
      pace: "7:22 min/km",
      calories: "820 kcal",
    },
  },
  {
    userEmail: "max.braun@test.de",
    username: "max_korb",
    userAvatar: "🏀",
    activity: {
      sport: "basketball",
      title: "Pickup Game am Donau-Platz",
      description: "3 Spiele gewonnen, 1 verloren. Gute Session! 🏀",
      duration: "1h 30min",
      calories: "710 kcal",
    },
  },
  {
    userEmail: "anna.hartmann@test.de",
    username: "anna_fit",
    userAvatar: "💪",
    activity: {
      sport: "fitness",
      title: "HIIT Session im Park",
      description: "30 Sekunden on, 15 off. 8 Runden. Ich bin fertig 😅",
      duration: "35 min",
      calories: "450 kcal",
    },
  },
  {
    userEmail: "lukas.mueller@test.de",
    username: "lukas_m",
    userAvatar: "⚽",
    activity: {
      sport: "fussball",
      title: "Training beim VfB",
      description: "Passspiel und Taktik heute. Zwei Tore geschossen! ⚽💥",
      duration: "1h 30min",
      calories: "750 kcal",
    },
  },
  {
    userEmail: "lisa.klein@test.de",
    username: "lisa_tennis",
    userAvatar: "🎾",
    activity: {
      sport: "tennis",
      title: "Match gegen Anna – 6:4, 3:6, 7:5",
      description: "Was ein Match! Drei Sätze, Tiebreak-Feeling. Tennis ist der beste Sport! 🎾",
      duration: "2h 10min",
      calories: "680 kcal",
    },
  },
];

async function seedActivities() {
  console.log("🌱 Starte Seeding von", ACTIVITIES.length, "Aktivitäten...\n");

  for (const item of ACTIVITIES) {
    try {
      const cred = await signInWithEmailAndPassword(auth, item.userEmail, "test123456");

      const hoursAgo = Math.floor(Math.random() * 48) + 1;
      const createdAt = new Date(Date.now() - hoursAgo * 3600000).toISOString();

      await addDoc(collection(db, "activities"), {
        ...item.activity,
        userId: cred.user.uid,
        username: item.username,
        userAvatar: item.userAvatar,
        image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        likes: Math.floor(Math.random() * 40) + 2,
        comments: 0,
        likedBy: [],
        createdAt,
      });

      console.log(`✅ "${item.activity.title}" von @${item.username}`);
    } catch (error) {
      console.log(`❌ "${item.activity.title}": ${error.message}`);
    }
  }

  console.log("\n🎉 Aktivitäten Seeding abgeschlossen!");
  process.exit(0);
}

seedActivities();
