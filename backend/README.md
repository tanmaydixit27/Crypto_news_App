# Crypto News Backend

Backend service for fetching crypto news, running sentiment analysis, storing results in Firestore, and broadcasting real-time updates over Socket.IO.

## Overview

This backend is built with TypeScript + Express and does the following:

- Fetches latest crypto news from CryptoCompare.
- Performs sentiment analysis on each article title/description.
- Persists sentiment records into Firebase Firestore.
- Protects API access using Firebase ID token verification.
- Broadcasts `sentiment-update` events to connected Socket.IO clients.
- Runs a periodic background refresh every 5 minutes.

## Tech Stack

- Node.js
- TypeScript (ESM)
- Express 5
- Socket.IO
- Firebase Admin SDK (Auth + Firestore)
- Axios
- sentiment (NLP sentiment scoring)

## Project Structure

```text
backend/
  src/
    app.ts                       # Express app + middleware + routes
    server.ts                    # HTTP server + Socket.IO + periodic job
    config/
      env.ts                     # Environment variable loader
      firebase.ts                # Firebase Admin + Firestore/Auth setup
    controllers/
      newsController.ts          # /latest handler + socket emit
    middleware/
      authMiddleware.ts          # Firebase Bearer token verification
    routes/
      newsRoutes.ts              # API routes
    services/
      newsService.ts             # CryptoCompare news fetch
      sentimentService.ts        # Sentiment analysis + Firestore writes
    types/
      sentiment.d.ts             # sentiment package typing override
```

## API and Realtime Flow

1. Client calls `GET /api/news/latest` with Firebase Bearer token.
2. Middleware verifies token using Firebase Admin Auth.
3. Backend fetches latest news from CryptoCompare.
4. Backend runs sentiment analysis for each article.
5. Backend stores each sentiment result in Firestore collection `sentiments`.
6. Backend returns JSON response with `articles` and `sentiments`.
7. Backend emits Socket.IO event `sentiment-update` (top 10 records) to all connected clients.

Additionally, `server.ts` runs the same fetch/analyze/emit process every 5 minutes in the background.

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- Firebase project with:
  - Firestore enabled
  - Service account key JSON
- A frontend or API client that can send Firebase ID tokens

## Environment Variables

Create/update `backend/.env`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FRONTEND_ORIGIN=http://localhost:3000
# Optional: custom Firestore DB name (defaults to "(default)")
# FIREBASE_DATABASE_ID=(default)
```

Notes:

- `FIREBASE_PROJECT_ID` is required.
- `FRONTEND_ORIGIN` supports comma-separated origins if needed.
- Firebase Admin credentials are loaded from `backend/firebase-service-account.json`.

## Firebase Service Account Setup

1. In Firebase Console: `Project settings -> Service accounts`.
2. Generate a new private key.
3. Save the JSON as:

```text
backend/firebase-service-account.json
```

Keep this file private and never commit it.

## Installation

From the `backend` directory:

```bash
npm install
```

## Running the Server

### Development

```bash
npm run dev
```

This starts the TypeScript server with `nodemon` + `tsx` and watches `src`.

### Production-like Start

```bash
npm run start
```

This expects compiled output in `dist/`.

## Available Scripts

- `npm run dev` - Run backend in watch mode.
- `npm run build` - Run TypeScript compiler.
- `npm run start` - Start compiled server (`dist/server.js`).

## REST API

### `GET /api/news/latest`

Fetch latest crypto news and sentiment results.

Auth: Required

- Header: `Authorization: Bearer <firebase_id_token>`

Success response (`200`):

```json
{
  "articles": [
    {
      "title": "...",
      "description": "...",
      "url": "https://...",
      "publishedAt": "2026-03-20T06:40:00.000Z",
      "source": { "name": "..." }
    }
  ],
  "sentiments": [
    {
      "articleUrl": "https://...",
      "title": "...",
      "score": 2,
      "comparative": 0.22,
      "positiveWords": ["gain"],
      "negativeWords": [],
      "timestamp": 1770000000000
    }
  ]
}
```

Error responses:

- `401` - No token / invalid token
- `500` - News fetch or sentiment pipeline failure

## Socket.IO

### Connection

Connect to the same backend origin/port.

### Events

- `sentiment-update`
  - Emitted:
    - after successful `GET /api/news/latest`
    - every 5 minutes by periodic background job
  - Payload: array of top 10 sentiment results

## Firestore Data

Collection used:

- `sentiments`

Document shape:

- `articleUrl: string`
- `title: string`
- `score: number`
- `comparative: number`
- `positiveWords: string[]`
- `negativeWords: string[]`
- `timestamp: number` (milliseconds since epoch)

## Security

- API route `/api/news/latest` is protected by Firebase token verification.
- Service account and `.env` should stay out of version control.
- CORS is currently open (`origin: *`); restrict in production.

## Troubleshooting

### 1. `401 Invalid token` on `/api/news/latest`

- Ensure frontend user is authenticated with Firebase.
- Ensure token is sent in `Authorization: Bearer <token>`.
- Verify service account belongs to the same Firebase project.

### 2. Firestore write errors

- Confirm Firestore is enabled.
- Check `FIREBASE_PROJECT_ID` value.
- Verify service account has Firestore access.
- If using named Firestore DB, set `FIREBASE_DATABASE_ID`.

### 3. Crypto news fetch failures

- Backend depends on `https://min-api.cryptocompare.com/data/v2/news/?lang=EN`.
- Check network access and remote API availability.

### 4. `npm run start` fails with missing `dist/server.js`

- Ensure build actually emits JavaScript files.
- Current `tsconfig.json` has `"noEmit": true`; if you want production build output, set it to `false` before running `npm run build`.

## Current Limitations

- No automated tests are configured.
- Sentiment writes are sequential per article; can be optimized for throughput.
- Socket auth is not enforced; only REST route is token protected.
- CORS is permissive by default.

## Recommended Next Improvements

- Add health endpoint (`/health`).
- Add rate limiting and request logging.
- Restrict CORS origin(s) for production.
- Add Jest/Vitest tests for route and service layers.
- Batch Firestore writes for better performance.

## License

ISC
