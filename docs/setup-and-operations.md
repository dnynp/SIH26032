# Setup and Operations

This document describes the project as it exists in this repository.

## Project Structure

```text
Backend/
  controllers/     Express request handlers
  middleware/      JWT authentication and role authorization
  models/          Mongoose schemas
  routes/          Express route definitions
  createAdmin.js   Script that creates a demo admin account
  seedDemoData.js  Repeatable demo seed script
  server.js        Express app and MongoDB startup

Frontend/
  src/components/  Shared UI components
  src/context/     Auth and language context providers
  src/i18n/        Translation strings
  src/pages/       Route-level React pages by role
  src/services/    Axios API wrapper and resource services
  vite.config.js   Vite development server config
```

The repository currently has no root-level build orchestrator. Run backend and frontend commands from their own directories.

## Backend

The backend entry point is `Backend/server.js`.

Startup behavior:

- Loads environment variables with `dotenv`.
- Connects to MongoDB with `mongoose.connect(process.env.MONGO_URI)`.
- Starts Express on port `5000` only after MongoDB connects.
- Enables JSON request bodies.
- Enables CORS for `http://localhost:5173`.
- Logs request method and path, but not request bodies.

Required backend environment variables:

- `MONGO_URI` - MongoDB connection string.
- `JWT_SECRET` - Secret used to sign and verify JWTs.

Backend commands from `Backend/`:

```bash
npm start
npm run seed:demo
npm test
```

`npm test` is not implemented; it intentionally exits with an error in `Backend/package.json`.

## Frontend

The frontend is a React + Vite app. Its routes are defined in `Frontend/src/App.jsx`.

The shared Axios instance lives in `Frontend/src/services/api.js`. It:

- Uses `import.meta.env.VITE_API_URL` when set.
- Falls back to `http://localhost:5000/api`.
- Adds the JWT from `localStorage.token` to requests as `Authorization: Bearer <token>`.
- Clears local auth data and redirects to `/login` on `401` responses.

Frontend environment variable:

- `VITE_API_URL` - API base URL exposed to the browser by Vite.

Frontend commands from `Frontend/`:

```bash
npm run dev
npm run build
npm run preview
```

Vite is configured to run on port `5173` in `Frontend/vite.config.js`.

## User Flows

Farmer:

- Register at `/register`.
- Log in at `/login`.
- Create a procurement request from `/farmer/create-request`.
- View own requests, queue status, procurement status, notifications, payments, and profile.

Officer:

- Log in with an account whose backend role is `Officer`.
- View procurement requests.
- Approve, reject, schedule, mark arrival, record quality, record weight, start processing, and mark procurement complete where the backend allows it.
- Create and complete payments for procured requests.

Admin:

- Log in with an account whose backend role is `Admin`.
- View dashboard totals.
- View all farmers, requests, and payments.

## Demo Data

`Backend/seedDemoData.js` creates demo farmer accounts, demo procurement requests, an officer account, and an admin account. It is designed to skip existing demo users with the same mobile numbers.

The script contains demo credentials in source because they are local/demo accounts. Do not reuse those credentials for production.

`Backend/createAdmin.js` creates a single demo admin account if it does not already exist.

## Verified Missing or Unimplemented Areas

No implementation was found for:

- CI/CD configuration.
- Docker or deployment configuration.
- Background jobs, queues, or cron tasks.
- Cache services such as Redis.
- File upload or external storage.
- Payment gateway integration.
- SMS, email, or voice-call provider integration.
- Automated tests.

The UI contains a farmer profile preference for calls, but no backend telephony endpoint or provider integration was found.
