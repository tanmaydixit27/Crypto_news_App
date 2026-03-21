// For Firebase JS SDK v7.20.0 and later, measurementId is optional.
// Config is env-only to avoid committing project credentials in source code.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase config env vars: ${missingKeys
      .map((key) => `REACT_APP_FIREBASE_${key.replace(/[A-Z]/g, (m) => `_${m}`).toUpperCase().replace(/^_/, '')}`)
      .join(', ')}`
  );
}

export default firebaseConfig;
