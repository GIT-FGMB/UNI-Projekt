# SportsFreunde – Web-Prototyp

Ein interaktiver Web-Prototyp einer Sport-Community-App, entwickelt im Rahmen eines Universitätsprojekts. Die Anwendung ermöglicht es Nutzern, Sportpartner zu finden, Events zu erstellen und sich über sportliche Aktivitäten auszutauschen.

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Features](#features)
- [Technologie-Stack](#technologie-stack)
- [Projektstruktur](#projektstruktur)
- [Installation & Setup](#installation--setup)
- [Firebase-Konfiguration](#firebase-konfiguration)
- [Starten der Anwendung](#starten-der-anwendung)

## Überblick

**SportsFreunde** ist ein klickbarer High-Fidelity-Prototyp, der als mobile Web-App in einem Phone-Frame dargestellt wird. Die App simuliert ein soziales Netzwerk für Sportbegeisterte mit Echtzeit-Datenanbindung über Firebase.

## Features

- **Registrierung & Login** – Mehrstufige Registrierung mit Sportarten-Auswahl und Erfahrungsstufen
- **Feed** – Chronologischer Feed aus Aktivitäten und Events
- **Events erstellen & verwalten** – Sportevents mit Datum, Ort und Teilnehmerverwaltung
- **Aktivitäten posten** – Sporteinheiten mit Details wie Dauer, Distanz und Tempo teilen
- **Sportpartner finden** – Nutzer in der Nähe nach Sportart und Level filtern
- **Echtzeit-Chat** – Direktnachrichten zwischen Nutzern
- **Profilsystem** – Detaillierte Profile mit Sportstatistiken, Follower-System und Avataren
- **Like- & Kommentarfunktion** – Interaktion mit Beiträgen anderer Nutzer
- **Standorterkennung** – Automatische Standortermittlung via Geolocation-API

## Technologie-Stack

| Kategorie       | Technologie                          |
|-----------------|--------------------------------------|
| Framework       | Next.js 14 (App Router)              |
| Sprache         | TypeScript                           |
| UI-Framework    | React 18                             |
| Styling         | Tailwind CSS 3                       |
| State-Management| Zustand                              |
| Backend / DB    | Firebase (Authentication, Firestore) |
| Icons           | Lucide React                         |

## Projektstruktur

```
Web-Prototyp/
├── app/
│   ├── globals.css          # Globale Styles & Tailwind-Imports
│   ├── layout.tsx           # Root-Layout
│   └── page.tsx             # Hauptseite mit Screen-Router
├── components/
│   ├── screens/             # Alle Bildschirme der App
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── CreateEventScreen.tsx
│   │   ├── EventDetailScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── FindFriendsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── UserProfileScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── InboxScreen.tsx
│   ├── ActivityCard.tsx     # Aktivitäts-Karte im Feed
│   ├── BottomNav.tsx        # Untere Navigation
│   ├── EventCard.tsx        # Event-Karte
│   ├── EventInfoCard.tsx    # Event-Info im Feed
│   ├── Header.tsx           # App-Header
│   └── PhoneFrame.tsx       # Smartphone-Rahmen
├── lib/
│   ├── avatar.ts            # Avatar-Generierung
│   ├── firebase.ts          # Firebase-Initialisierung
│   └── store.ts             # Zustand Store (State & Logik)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Installation & Setup

### Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher empfohlen)
- npm (wird mit Node.js mitgeliefert)
- Ein moderner Webbrowser (Chrome, Firefox, Edge, Safari)

### Schritt-für-Schritt-Anleitung

```bash
# 1. Repository klonen
git clone https://github.com/GIT-FGMB/UNI-Projekt.git

# 2. In das Projektverzeichnis wechseln
cd UNI-Projekt

# 3. Abhängigkeiten installieren
npm install

# 4. Entwicklungsserver starten
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) im Browser erreichbar.

> **Hinweis:** Beim ersten Start muss ein neues Konto über „Neues Konto erstellen" registriert werden. Eine separate Firebase-Einrichtung ist **nicht** nötig – die Konfiguration ist bereits im Projekt enthalten.

## Firebase

### Konfiguration

Das Projekt nutzt Firebase für Authentifizierung (Firebase Auth) und Datenbank (Cloud Firestore). Die Konfiguration befindet sich in `lib/firebase.ts` und ist mit dem Firebase-Projekt **app-sportsfreunde** verbunden. Es ist keine zusätzliche Konfiguration durch den Nutzer erforderlich.

### Firestore Security Rules

Damit die App korrekt funktioniert, müssen folgende Regeln in der [Firebase Console](https://console.firebase.google.com/) unter **Firestore Database → Regeln** hinterlegt sein:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read, write: if request.auth != null;
    }
    match /events/{eventId}/comments/{commentId} {
      allow read, write: if request.auth != null;
    }
    match /activities/{activityId} {
      allow read, write: if request.auth != null;
    }
    match /activities/{activityId}/comments/{commentId} {
      allow read, write: if request.auth != null;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Testdaten laden (optional)

Im Ordner `scripts/` befinden sich Seed-Skripte, um die Datenbank mit Beispieldaten zu befüllen:

```bash
node scripts/seed-users.mjs       # Beispiel-Nutzer anlegen
node scripts/seed-events.mjs      # Beispiel-Events erstellen
node scripts/seed-activities.mjs  # Beispiel-Aktivitäten erstellen
```

## Verfügbare Befehle

| Befehl          | Beschreibung                              |
|-----------------|-------------------------------------------|
| `npm run dev`   | Startet den Entwicklungsserver            |
| `npm run build` | Erstellt einen optimierten Produktions-Build |
| `npm start`     | Startet den Produktions-Build             |
