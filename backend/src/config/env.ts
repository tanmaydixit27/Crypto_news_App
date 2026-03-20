import dotenv from 'dotenv';
dotenv.config();

const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  PORT: process.env.PORT || 5000,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FRONTEND_ORIGINS: frontendOrigins,
};
