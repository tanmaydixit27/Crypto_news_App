// src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  // NEWSAPI_KEY removed — not needed
};