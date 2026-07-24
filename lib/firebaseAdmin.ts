import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";

// Server-side Firebase Admin singleton. Reads FIREBASE_SERVICE_ACCOUNT
// (single-line JSON) from env. Initialized lazily so importing this module
// during build (when env is empty) doesn't crash.

let cachedApp: App | null = null;

function getOrInitApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApps()[0];
    return cachedApp;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
  }
  const credential = cert(JSON.parse(raw));
  cachedApp = initializeApp({ credential });
  return cachedApp;
}

export function getAdminMessaging(): Messaging {
  return getMessaging(getOrInitApp());
}
