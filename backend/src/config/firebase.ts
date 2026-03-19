// src/config/firebase.ts
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';  // Namespace for global utils like setLogLevel
import serviceAccount from '../../firebase-service-account.json' with { type: 'json' };
import { env } from './env.js';

// Enable SDK-level traces early
;(admin as any).setLogLevel?.('debug');

// Type the service account
const typedServiceAccount = serviceAccount as ServiceAccount;

// Initialize only if not already done
if (!getApps().length) {
  initializeApp({
    credential: cert(typedServiceAccount),
    projectId: env.FIREBASE_PROJECT_ID,
    databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const app = getApps()[0];  // Get the initialized app instance

// Handle databaseId safely (log for debug)
const databaseId = ((env as { FIREBASE_DATABASE_ID?: string }).FIREBASE_DATABASE_ID?.toString()) || '(default)';
console.log(`[Firebase] Initialized with databaseId: ${databaseId}`);  // Debug: Shows in terminal on startup

// Firestore instance
export const firestore = getFirestore(app, databaseId);

export const auth = getAuth(app);