import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { env } from './env.js';

;(admin as any).setLogLevel?.('debug');

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(currentDir, '..', '..');
const serviceAccountPath = path.resolve(backendRoot, 'firebase-service-account.json');
const databaseId =
  ((env as { FIREBASE_DATABASE_ID?: string }).FIREBASE_DATABASE_ID?.toString()) || '(default)';

let firestore: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
      initializeApp({
        credential: cert(serviceAccount),
        projectId: env.FIREBASE_PROJECT_ID,
        databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      console.log('[Firebase] Initialized using FIREBASE_SERVICE_ACCOUNT_JSON');
    } else if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, 'utf8')
      ) as ServiceAccount;
      initializeApp({
        credential: cert(serviceAccount),
        projectId: env.FIREBASE_PROJECT_ID,
        databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      console.log(`[Firebase] Initialized using service account file at ${serviceAccountPath}`);
    } else {
      // Works in environments that provide Application Default Credentials (for example GCP runtimes).
      initializeApp({
        credential: applicationDefault(),
        projectId: env.FIREBASE_PROJECT_ID,
        databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
      console.log('[Firebase] Initialized using Application Default Credentials');
    }
  }

  const app = getApps()[0];
  console.log(`[Firebase] Firestore databaseId: ${databaseId}`);
  firestore = getFirestore(app, databaseId);
  auth = getAuth(app);
} catch (error) {
  console.warn('[Firebase] Initialization failed. Auth-protected routes will return 503.');
  console.warn(
    `[Firebase] Provide one of: backend/firebase-service-account.json, FIREBASE_SERVICE_ACCOUNT_JSON, or Application Default Credentials for project ${env.FIREBASE_PROJECT_ID}.`
  );
  console.warn(error);
}

export { firestore, auth };
