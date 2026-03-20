import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { env } from './env.js';

;(admin as any).setLogLevel?.('debug');

const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
const databaseId =
  ((env as { FIREBASE_DATABASE_ID?: string }).FIREBASE_DATABASE_ID?.toString()) || '(default)';

let firestore: Firestore | null = null;
let auth: Auth | null = null;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, 'utf8')
  ) as ServiceAccount;

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: env.FIREBASE_PROJECT_ID,
      databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }

  const app = getApps()[0];
  console.log(`[Firebase] Initialized with databaseId: ${databaseId}`);
  firestore = getFirestore(app, databaseId);
  auth = getAuth(app);
} else {
  console.warn(
    `[Firebase] Skipping initialization. Missing service account file at ${serviceAccountPath}`
  );
}

export { firestore, auth };
