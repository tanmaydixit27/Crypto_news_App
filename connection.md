# Frontend-Backend Connection Plan

## Target Integration

Use backend as the single source for crypto news and sentiment. Keep direct CoinGecko calls for market prices/charts unless those are also moved behind backend later.

## Current Gap

- Frontend currently calls CoinGecko directly.
- Backend exposes protected `GET /api/news/latest`.
- Frontend has no wired backend base URL/proxy and no Socket.IO client subscription for backend realtime sentiment events.

## Approach

1. Define frontend backend config
- Add `frontend/.env`:
  - `REACT_APP_API_BASE_URL=http://localhost:5000`
  - `REACT_APP_SOCKET_URL=http://localhost:5000`
- Create a frontend API client module (`axios` instance) using `REACT_APP_API_BASE_URL`.

2. Attach Firebase token to backend requests
- Before calling `/api/news/latest`, get ID token from current user:
  - `const token = await auth.currentUser?.getIdToken();`
- Send:
  - `Authorization: Bearer <token>`
- This is required because backend route uses Firebase token verification middleware.

3. Create a news service on frontend
- Add `frontend/src/services/newsService.js`:
  - `getLatestNews(token)` -> calls `/api/news/latest`
- Keep backend request logic out of UI components for reuse and clarity.

4. Add app state for backend news/sentiment
- In `CryptoContext` (or `NewsContext`), add:
  - `newsArticles`, `sentiments`, `newsLoading`, `newsError`
- Add `fetchLatestNews()`:
  - checks auth
  - gets token
  - calls backend service
  - stores `articles` and `sentiments`

5. Trigger fetch at correct lifecycle points
- Fetch when:
  - user logs in
  - app starts with existing authenticated user
  - user manually refreshes
- If no user token:
  - either skip with a restricted-state message
  - or show "Login required for news"

6. Wire Socket.IO realtime updates (optional, recommended)
- Add `socket.io-client` in frontend.
- Connect using `REACT_APP_SOCKET_URL`.
- Subscribe to `sentiment-update`.
- Update state from incoming payload.
- Remove listeners on unmount to prevent duplicate handlers.

7. CORS and origin hardening
- Backend currently uses permissive CORS.
- For production, restrict to known frontend origins.
- For local development, allow localhost frontend origin(s).

8. Error handling contract
- Handle backend statuses:
  - `401`: missing/expired token -> prompt re-auth/login
  - `500`: backend/news/sentiment failure -> show retry option
- Provide retry action in UI for news fetch.

9. Development workflow
- Run backend on `5000`, frontend on `3000`.
- Use env-based URLs instead of hardcoded endpoints.
- Optional: use CRA `proxy` in frontend `package.json`.

10. Validation checklist
- Login from frontend.
- Confirm `/api/news/latest` request includes Bearer token.
- Confirm response contains `articles` and `sentiments`.
- Confirm UI renders both.
- Confirm socket receives `sentiment-update`:
  - after `/latest` call
  - and periodic backend refresh interval

## Recommended File-Level Plan

1. `frontend/.env` (new): backend URL config
2. `frontend/src/services/newsService.js` (new): backend API wrapper
3. `frontend/src/CryptoContext.js` (edit): news/sentiment state and fetch flow
4. Frontend components (edit): display news/sentiment/loading/error
5. `backend/src/app.ts` (optional edit): tighten CORS
6. Backend socket/auth area (optional edit): socket auth hardening

## Suggested Implementation Order

1. REST integration with Firebase token
2. UI rendering for backend payload
3. Socket.IO realtime updates
4. CORS/security hardening
5. Refactor cleanup if needed

## Change Log

### 2026-03-20
- Added this `connection.md` file with the complete frontend-backend wiring approach and execution plan.
- Added frontend backend URL env file: `frontend/.env`.
- Added frontend backend config module: `frontend/src/config/backend.js`.
- Added frontend backend news service with Bearer token support: `frontend/src/services/newsService.js`.
- Reworked `frontend/src/CryptoContext.js`:
  - fixed auth subscription lifecycle
  - added `fetchLatestNews()` with Firebase ID token flow
  - added news/sentiment/loading/error state
  - added auto-fetch on authenticated session
  - added Socket.IO realtime listener for `sentiment-update`
- Added frontend UI component for backend news/sentiment feed: `frontend/src/components/NewsSentiment.js`.
- Updated home page composition to render news/sentiment panel: `frontend/src/Pages/Home.js`.
- Added frontend dependency: `socket.io-client` in `frontend/package.json` and installed it.
- Tightened backend CORS config:
  - added `FRONTEND_ORIGIN` parsing in `backend/src/config/env.ts`
  - updated Express CORS in `backend/src/app.ts`
  - updated Socket.IO CORS in `backend/src/server.ts`
- Added env templates:
  - `frontend/.env.example`
  - `backend/.env.example`
- Updated backend docs for new CORS env: `backend/README.md`.
- Verification completed:
  - `backend`: `npm run build` passed
  - `frontend`: `npm run build` passed
- Build artifact cleanup for GitHub/Netlify workflow:
  - updated `frontend/.gitignore` to ignore `build/` and local `.env*` files
  - removed already-tracked `frontend/build` files from git index using `git rm --cached`
  - result: future commits will not include generated build artifacts
- Added comprehensive root project documentation in `README.md`:
  - architecture overview
  - setup prerequisites
  - backend/frontend environment configuration
  - local development run instructions
  - API and Socket.IO event documentation
  - deployment and troubleshooting guidance
