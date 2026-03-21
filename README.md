# Crypto News App

Full-stack crypto dashboard with:
- Market data from CoinGecko (frontend)
- Authenticated crypto news + sentiment analysis (backend)
- Realtime sentiment updates via Socket.IO
- Firebase Auth + Firestore integration

## Tech Stack

- Frontend: React (CRA), Material UI, Axios, Firebase Web SDK, Socket.IO client
- Backend: Node.js, Express (TypeScript), Firebase Admin SDK, Axios, Socket.IO
- Data Sources:
  - CoinGecko API (prices/charts/trending)
  - CryptoCompare News API (news feed for sentiment pipeline)

## Project Structure

```text
Crypto_news_App/
  backend/
    src/
      app.ts
      server.ts
      config/
      controllers/
      middleware/
      routes/
      services/
  frontend/
    src/
      components/
      config/
      services/
      Pages/
      CryptoContext.js
```

## Features

- Crypto coin list, details, chart, and watchlist
- Firebase email/password and Google sign-in
- Protected backend endpoint: `GET /api/news/latest`
- Sentiment scoring for fetched news articles
- Firestore persistence of sentiment records
- Realtime `sentiment-update` broadcast to connected frontend clients

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- Firebase project with:
  - Authentication enabled
  - Firestore enabled
  - Service account key for backend

## Environment Setup

### 1) Backend env

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FRONTEND_ORIGIN=http://localhost:3000
```

Also place service account file at:

```text
backend/firebase-service-account.json
```

### 2) Frontend env

Create `frontend/.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3) Firebase Auth Google provider setup (required for OAuth)

In Firebase Console for the same `projectId` used by frontend and backend:

1. Go to `Authentication -> Sign-in method` and enable `Google`.
2. Go to `Authentication -> Settings -> Authorized domains` and add your frontend domain(s), for example:
   - `localhost` for local dev
   - your deployed frontend domain
3. Ensure backend service account is from the same Firebase project.

## Install Dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

## Run Locally

Open two terminals:

```bash
# terminal 1 - backend
cd backend
npm run dev
```

```bash
# terminal 2 - frontend
cd frontend
npm start
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## API

### `GET /api/news/latest`

- Auth: required
- Header:

```http
Authorization: Bearer <firebase_id_token>
```

- Success response:

```json
{
  "articles": [],
  "sentiments": []
}
```

- Common errors:
  - `401` missing/invalid token
  - `503` Firebase Admin not configured
  - `500` fetch/sentiment pipeline failure

## Realtime Events

Socket.IO server runs on backend and emits:

- `sentiment-update`: array of top sentiment items

Emit triggers:
- after successful `/api/news/latest`
- periodic backend refresh job (every 5 minutes)

## Frontend-Backend Connection Flow

1. User authenticates with Firebase in frontend.
2. Frontend gets Firebase ID token from user session.
3. Frontend calls backend `/api/news/latest` with Bearer token.
4. Backend verifies token, fetches news, computes sentiment, stores in Firestore.
5. Backend returns `{ articles, sentiments }` and emits `sentiment-update`.
6. Frontend updates UI from REST response and Socket.IO stream.

## Build and Deployment

- Do not commit `frontend/build` for GitHub -> Netlify workflow.
- Netlify should build from source during deploy.
- `frontend/.gitignore` is configured to ignore `build/`.

## Scripts

### Backend

- `npm run dev`: start backend in watch mode
- `npm run build`: TypeScript compile check/build
- `npm run start`: run compiled backend (`dist/server.js`)

### Frontend

- `npm start`: run development server
- `npm run build`: production build
- `npm test`: test runner

## Troubleshooting

- `401 Invalid token`:
  - user is not logged in
  - wrong Firebase project pairing between frontend and backend
- `503 Firebase auth is not configured`:
  - missing `backend/firebase-service-account.json`
- No realtime updates:
  - verify `REACT_APP_SOCKET_URL`
  - verify backend is running and CORS origin is correct
- CORS errors:
  - set backend `FRONTEND_ORIGIN` to your frontend URL(s), comma-separated if needed

## Notes

- Detailed integration plan and change log are maintained in:
  - `connection.md`
