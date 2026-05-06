import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";

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

const EVENTS = [
  {
    userEmail: "lukas.mueller@test.de",
    username: "lukas_m",
    userAvatar: "⚽",
    event: {
      title: "Fußball Freundschaftsspiel im Schlossgarten",
      description: "Wir treffen uns zum lockeren Kicken im Stuttgarter Schlossgarten. Alle Levels willkommen! Bringt gute Laune mit ⚽",
      sport: "fussball",
      location: "Schlossgarten, Stuttgart",
      date: "2026-05-10",
      time: "16:00",
    },
  },
  {
    userEmail: "sarah.wagner@test.de",
    username: "sarah_runs",
    userAvatar: "🏃",
    event: {
      title: "10km Lauftreff am Sonntagmorgen",
      description: "Gemeinsam laufen macht mehr Spaß! Tempo ca. 5:30-6:00 min/km. Route entlang der Alb durch den Wald 🌲",
      sport: "laufen",
      location: "Stadtgarten Karlsruhe",
      date: "2026-05-11",
      time: "08:00",
    },
  },
  {
    userEmail: "jan.becker@test.de",
    username: "jan_power",
    userAvatar: "💪",
    event: {
      title: "Outdoor HIIT Workout am Neckar",
      description: "45min High Intensity Interval Training draußen. Keine Geräte nötig, nur Motivation! 💪🔥",
      sport: "fitness",
      location: "Neckarufer, Mannheim",
      date: "2026-05-09",
      time: "18:30",
    },
  },
  {
    userEmail: "emma.schneider@test.de",
    username: "emma_yoga",
    userAvatar: "🧘",
    event: {
      title: "Yoga im Park – Vinyasa Flow",
      description: "60min Vinyasa Flow im Seepark. Bringt eure eigene Matte mit. Für alle Level geeignet 🙏☀️",
      sport: "yoga",
      location: "Seepark, Freiburg",
      date: "2026-05-12",
      time: "09:00",
    },
  },
  {
    userEmail: "felix.hoffmann@test.de",
    username: "felix_bike",
    userAvatar: "🚴",
    event: {
      title: "Rennrad-Tour Schwäbische Alb",
      description: "60km Tour über die Alb mit ca. 800hm. Tempo moderat, Gruppenerlebnis steht im Vordergrund 🚴‍♂️",
      sport: "radfahren",
      location: "Marktplatz Tübingen",
      date: "2026-05-10",
      time: "07:30",
    },
  },
  {
    userEmail: "nina.fischer@test.de",
    username: "nina_splash",
    userAvatar: "🏊",
    event: {
      title: "Freiwasser-Schwimmen Bodensee",
      description: "2km Schwimmen im Bodensee entlang der Uferpromenade. Neopren empfohlen! 🌊",
      sport: "schwimmen",
      location: "Strandbad Konstanz",
      date: "2026-05-13",
      time: "10:00",
    },
  },
  {
    userEmail: "max.braun@test.de",
    username: "max_korb",
    userAvatar: "🏀",
    event: {
      title: "Streetball 3v3 Turnier",
      description: "Lockeres 3-gegen-3 Basketball auf dem Outdoor-Court. Teams werden vor Ort eingeteilt 🏀",
      sport: "basketball",
      location: "Basketballplatz Friedrichsau, Ulm",
      date: "2026-05-11",
      time: "14:00",
    },
  },
  {
    userEmail: "lisa.klein@test.de",
    username: "lisa_tennis",
    userAvatar: "🎾",
    event: {
      title: "Tennis Doppel – Mitspieler gesucht!",
      description: "Suche Partner/in für Mixed Doppel am Samstag. Platz ist reserviert! Anfänger willkommen 🎾",
      sport: "tennis",
      location: "TC Heidelberg, Platz 3",
      date: "2026-05-10",
      time: "11:00",
    },
  },
  {
    userEmail: "tobias.wolf@test.de",
    username: "tobi_handball",
    userAvatar: "🤾",
    event: {
      title: "Handball Training – Neue Spieler willkommen",
      description: "Offenes Training beim TSV Pforzheim. Wir suchen neue Leute für unsere Hobbymannschaft! 🤾‍♂️",
      sport: "handball",
      location: "Sporthalle TSV Pforzheim",
      date: "2026-05-14",
      time: "19:00",
    },
  },
  {
    userEmail: "marie.weber@test.de",
    username: "marie_laeuft",
    userAvatar: "🏃",
    event: {
      title: "Trail-Run durch die Schwäbische Alb",
      description: "15km Trailrun durch den Wald mit schönem Panorama. Gemütliches Tempo, Natur genießen 🌲🏃‍♀️",
      sport: "laufen",
      location: "Wanderparkplatz Reutlingen-Sondelfingen",
      date: "2026-05-11",
      time: "09:30",
    },
  },
  {
    userEmail: "david.schmidt@test.de",
    username: "david_volley",
    userAvatar: "🏐",
    event: {
      title: "Beachvolleyball am Samstag",
      description: "Wer hat Lust auf Beachvolleyball? 4 gegen 4, alle Level, Hauptsache Spaß! 🏐☀️",
      sport: "volleyball",
      location: "Beachfeld Cannstatter Wasen, Stuttgart",
      date: "2026-05-10",
      time: "15:00",
    },
  },
  {
    userEmail: "anna.hartmann@test.de",
    username: "anna_fit",
    userAvatar: "💪",
    event: {
      title: "Pilates im Schlosspark",
      description: "60min Pilates Session im Freien. Matte mitbringen! Perfekt für Core-Stability und Entspannung 🧘‍♀️",
      sport: "fitness",
      location: "Schlosspark Karlsruhe",
      date: "2026-05-12",
      time: "10:30",
    },
  },
  {
    userEmail: "sarah.wagner@test.de",
    username: "sarah_runs",
    userAvatar: "🏃",
    event: {
      title: "Intervalltraining im Stadion",
      description: "6x1000m Intervalle auf der Tartanbahn. Wer will seine Geschwindigkeit verbessern? ⏱️🏃‍♀️",
      sport: "laufen",
      location: "Europahalle Stadion, Karlsruhe",
      date: "2026-05-14",
      time: "17:30",
    },
  },
  {
    userEmail: "felix.hoffmann@test.de",
    username: "felix_bike",
    userAvatar: "🚴",
    event: {
      title: "Gravel Ride – Schönbuch Wald",
      description: "40km Gravel Tour durch den Schönbuch. Gemischtes Terrain, Gravelbike oder MTB empfohlen 🌳🚴",
      sport: "radfahren",
      location: "Waldparkplatz Bebenhausen",
      date: "2026-05-13",
      time: "08:00",
    },
  },
];

async function seedEvents() {
  console.log("🌱 Starte Seeding von", EVENTS.length, "Events...\n");

  for (const item of EVENTS) {
    try {
      // Login as user to get their uid
      const cred = await signInWithEmailAndPassword(auth, item.userEmail, "test123456");

      const daysAgo = Math.floor(Math.random() * 5);
      const hoursAgo = Math.floor(Math.random() * 12);
      const createdAt = new Date(Date.now() - daysAgo * 86400000 - hoursAgo * 3600000).toISOString();

      const eventDoc = {
        ...item.event,
        userId: cred.user.uid,
        username: item.username,
        userAvatar: item.userAvatar,
        image: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        likes: Math.floor(Math.random() * 30) + 3,
        comments: Math.floor(Math.random() * 10),
        likedBy: [],
        createdAt,
      };

      await addDoc(collection(db, "events"), eventDoc);
      await updateDoc(doc(db, "users", cred.user.uid), { eventsCount: increment(1) });

      console.log(`✅ "${item.event.title}" von @${item.username}`);
    } catch (error) {
      console.log(`❌ "${item.event.title}": ${error.message}`);
    }
  }

  console.log("\n🎉 Events Seeding abgeschlossen!");
  process.exit(0);
}

seedEvents();
