import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

const TEST_USERS = [
  {
    email: "lukas.mueller@test.de",
    password: "test123456",
    profile: {
      username: "lukas_m",
      displayName: "Lukas Müller",
      avatar: "⚽",
      bio: "Stürmer mit Leidenschaft! Spiele seit 15 Jahren im Verein.",
      sport: "fussball",
      age: 27,
      latitude: 48.7758,
      longitude: 9.1829,
      city: "Stuttgart",
      sportStats: { level: "fortgeschritten", strength: "Stürmer, schneller Antritt", frequency: "4-5x/Woche" },
      followers: 189,
      following: 95,
      eventsCount: 8,
    },
  },
  {
    email: "sarah.wagner@test.de",
    password: "test123456",
    profile: {
      username: "sarah_runs",
      displayName: "Sarah Wagner",
      avatar: "🏃",
      bio: "Marathonläuferin aus Karlsruhe 🏅 PB: 3:28h",
      sport: "laufen",
      age: 31,
      latitude: 49.0069,
      longitude: 8.4037,
      city: "Karlsruhe",
      sportStats: { level: "profi", pace: "4:55 min/km", distance: "42 km", frequency: "4-5x/Woche" },
      followers: 412,
      following: 178,
      eventsCount: 22,
    },
  },
  {
    email: "jan.becker@test.de",
    password: "test123456",
    profile: {
      username: "jan_power",
      displayName: "Jan Becker",
      avatar: "💪",
      bio: "Kraftsport & Functional Training. Gym ist mein zweites Zuhause.",
      sport: "fitness",
      age: 25,
      latitude: 49.4875,
      longitude: 8.4660,
      city: "Mannheim",
      sportStats: { level: "fortgeschritten", strength: "Krafttraining, CrossFit", frequency: "4-5x/Woche" },
      followers: 267,
      following: 134,
      eventsCount: 11,
    },
  },
  {
    email: "emma.schneider@test.de",
    password: "test123456",
    profile: {
      username: "emma_yoga",
      displayName: "Emma Schneider",
      avatar: "🧘",
      bio: "Zertifizierte Yoga-Lehrerin 🙏 Vinyasa & Yin Yoga",
      sport: "yoga",
      age: 29,
      latitude: 47.9990,
      longitude: 7.8421,
      city: "Freiburg",
      sportStats: { level: "profi", strength: "Vinyasa, Yin Yoga", frequency: "Täglich" },
      followers: 534,
      following: 210,
      eventsCount: 35,
    },
  },
  {
    email: "felix.hoffmann@test.de",
    password: "test123456",
    profile: {
      username: "felix_bike",
      displayName: "Felix Hoffmann",
      avatar: "🚴",
      bio: "Rennrad & Gravel. Die Schwäbische Alb ist mein Revier!",
      sport: "radfahren",
      age: 34,
      latitude: 48.5216,
      longitude: 9.0576,
      city: "Tübingen",
      sportStats: { level: "fortgeschritten", pace: "28 km/h", distance: "80 km", frequency: "2-3x/Woche" },
      followers: 321,
      following: 167,
      eventsCount: 15,
    },
  },
  {
    email: "nina.fischer@test.de",
    password: "test123456",
    profile: {
      username: "nina_splash",
      displayName: "Nina Fischer",
      avatar: "🏊",
      bio: "Freiwasserschwimmerin am Bodensee 🌊",
      sport: "schwimmen",
      age: 26,
      latitude: 47.6603,
      longitude: 9.1753,
      city: "Konstanz",
      sportStats: { level: "fortgeschritten", pace: "1:40 min/100m", distance: "3 km", frequency: "4-5x/Woche" },
      followers: 198,
      following: 88,
      eventsCount: 9,
    },
  },
  {
    email: "max.braun@test.de",
    password: "test123456",
    profile: {
      username: "max_korb",
      displayName: "Max Braun",
      avatar: "🏀",
      bio: "Basketball seit der Schulzeit 🏀 Point Guard",
      sport: "basketball",
      age: 23,
      latitude: 48.4011,
      longitude: 9.9876,
      city: "Ulm",
      sportStats: { level: "fortgeschritten", strength: "Point Guard, Schnelligkeit", frequency: "2-3x/Woche" },
      followers: 156,
      following: 112,
      eventsCount: 6,
    },
  },
  {
    email: "lisa.klein@test.de",
    password: "test123456",
    profile: {
      username: "lisa_tennis",
      displayName: "Lisa Klein",
      avatar: "🎾",
      bio: "Tennis-Verrückte aus Heidelberg 🎾 Suche Doppelpartner!",
      sport: "tennis",
      age: 28,
      latitude: 49.3988,
      longitude: 8.6724,
      city: "Heidelberg",
      sportStats: { level: "anfaenger", strength: "Grundlinie, guter Aufschlag", frequency: "2-3x/Woche" },
      followers: 87,
      following: 65,
      eventsCount: 4,
    },
  },
  {
    email: "tobias.wolf@test.de",
    password: "test123456",
    profile: {
      username: "tobi_handball",
      displayName: "Tobias Wolf",
      avatar: "🤾",
      bio: "Handball ist Teamsport! Kreisläufer beim TSV Pforzheim",
      sport: "handball",
      age: 30,
      latitude: 48.8922,
      longitude: 8.6946,
      city: "Pforzheim",
      sportStats: { level: "fortgeschritten", strength: "Kreisläufer, Abwehr", frequency: "2-3x/Woche" },
      followers: 143,
      following: 98,
      eventsCount: 7,
    },
  },
  {
    email: "marie.weber@test.de",
    password: "test123456",
    profile: {
      username: "marie_laeuft",
      displayName: "Marie Weber",
      avatar: "🏃",
      bio: "Trailrunning in der Schwäbischen Alb 🌲 Natur pur!",
      sport: "laufen",
      age: 33,
      latitude: 48.4914,
      longitude: 9.2147,
      city: "Reutlingen",
      sportStats: { level: "anfaenger", pace: "6:20 min/km", distance: "15 km", frequency: "2-3x/Woche" },
      followers: 76,
      following: 54,
      eventsCount: 3,
    },
  },
  {
    email: "david.schmidt@test.de",
    password: "test123456",
    profile: {
      username: "david_volley",
      displayName: "David Schmidt",
      avatar: "🏐",
      bio: "Beachvolleyball im Sommer, Halle im Winter 🏐",
      sport: "volleyball",
      age: 22,
      latitude: 48.7758,
      longitude: 9.1829,
      city: "Stuttgart",
      sportStats: { level: "anfaenger", strength: "Zuspieler, guter Block", frequency: "1x/Woche" },
      followers: 64,
      following: 41,
      eventsCount: 2,
    },
  },
  {
    email: "anna.hartmann@test.de",
    password: "test123456",
    profile: {
      username: "anna_fit",
      displayName: "Anna Hartmann",
      avatar: "💪",
      bio: "HIIT, Pilates & alles was Spaß macht 💪",
      sport: "fitness",
      age: 24,
      latitude: 49.0069,
      longitude: 8.4037,
      city: "Karlsruhe",
      sportStats: { level: "anfaenger", strength: "HIIT, Pilates", frequency: "2-3x/Woche" },
      followers: 112,
      following: 78,
      eventsCount: 5,
    },
  },
];

async function seedUsers() {
  console.log("🌱 Starte Seeding von", TEST_USERS.length, "Test-Usern...\n");

  for (const userData of TEST_USERS) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      await setDoc(doc(db, "users", cred.user.uid), userData.profile);
      console.log(`✅ ${userData.profile.displayName} (${userData.profile.city}) - @${userData.profile.username}`);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log(`⏭️  ${userData.profile.displayName} existiert bereits`);
      } else {
        console.log(`❌ ${userData.profile.displayName}: ${error.message}`);
      }
    }
  }

  console.log("\n🎉 Seeding abgeschlossen!");
  process.exit(0);
}

seedUsers();
