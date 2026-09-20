# Kisan Setu Frontend

This is the React + Vite frontend for Kisan Setu, the Smart Procurement Platform in this repository.

It talks to the Express backend through REST APIs. The shared API client is `src/services/api.js`.

## Setup

From `Frontend/`:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

By default, it calls `http://localhost:5000/api`. To point it somewhere else, create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Main Folders

```text
src/
  components/  Shared layout, route guards, status badges, cards, empty states
  context/     AuthContext and LanguageContext
  i18n/        English, Hindi, and Marathi translation strings
  pages/       Route-level screens grouped by user role
  services/    Axios API calls grouped by backend resource
```

## Routing

Routes are defined in `src/App.jsx`.

User areas:

- Farmer pages live under `/farmer/...`.
- Officer pages live under `/officer/...`.
- Admin pages live under `/admin/...`.

`src/components/ProtectedRoute.jsx` handles frontend redirects for logged-out users and wrong-role users. The backend still does the real authorization.

## Auth

`src/context/AuthContext.jsx` stores the logged-in user and JWT in `localStorage`.

`src/services/api.js` adds the JWT to requests as a bearer token. If the backend returns `401`, it clears local auth state and redirects to `/login`.

## Language Support

`src/i18n/translations.js` contains English, Hindi, and Marathi text. `LanguageContext` exposes `t('key.path')` and stores the selected language in `localStorage`.

Farmer-facing pages and shared navigation use translations. Officer and admin pages still contain mostly English UI text.

## Queue Prediction

`src/components/AiQueuePrediction.jsx` renders queue information on farmer pages. The current backend returns a rule-based estimate: `peopleAhead * 10` minutes.

The component can display a richer `queue.aiPrediction` object if a backend endpoint starts returning one later, but no verified AI prediction service exists in this repository right now.

## Voice Call Preference

The farmer profile page includes a "Call me when my turn is near" preference. It is stored locally in the browser only. There is no backend endpoint or telephony provider integration for calls in the current project.

## Manual Testing Checklist

1. Register a farmer at `/register`.
2. Log in at `/login` and confirm refresh keeps the user logged in.
3. Create a request from `/farmer/create-request`.
4. Confirm the request appears in farmer requests, queue, and status pages.
5. Log in as an officer and move the request through valid operational steps.
6. Create and complete a payment after procurement is complete.
7. Log in as an admin and confirm dashboard, farmer, request, and payment views load.
8. Try opening a route for the wrong role and confirm the frontend redirects.

For backend details, see the root `docs/` directory.
