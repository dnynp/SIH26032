# Project Workflow and Structure

This document explains the current project flow after the UI redesign. It is derived from the existing repository.

## Application Shape

Kisan Setu has two separate apps:

- `Backend/` is the Express and MongoDB API.
- `Frontend/` is the React and Vite user interface.

The frontend talks to the backend through REST endpoints under `/api`. The shared Axios client is `Frontend/src/services/api.js`.

## Main User Roles

Farmer:

- Registers with name, mobile, password and location details.
- Logs in with mobile and password.
- Creates procurement requests.
- Tracks request status, queue position, notifications, profile and payments.

Officer:

- Logs in with an officer account.
- Views procurement requests.
- Moves requests through approval, scheduling, arrival, quality check, weighing, processing and completion.
- Creates and completes payment records after procurement is complete.

Admin:

- Logs in with an admin account.
- Views dashboard counts.
- Reviews farmers, procurement requests and payment records.

## Request Workflow

1. A farmer registers or logs in.
2. The frontend stores the JWT in `localStorage`.
3. The farmer creates a procurement request from `/farmer/create-request`.
4. The backend creates a `ProcurementRequest`, generates a token with `Counter`, and creates a notification.
5. Officers or admins advance the request through valid backend-controlled states.
6. The farmer checks queue and status pages for progress.
7. After procurement is completed, an officer or admin creates a payment.
8. Payment completion creates a farmer notification.

## Frontend Structure

```text
Frontend/src/
  App.jsx                 Public, farmer, officer and admin routes
  index.css               Global design system and responsive layout styles
  components/             Shared UI components
  context/                Auth and language providers
  i18n/                   English, Hindi and Marathi strings
  pages/
    auth/                 Login and register
    farmer/               Farmer dashboard, requests, queue, status, notifications, payments, profile
    officer/              Officer dashboard, requests, farmers, payments
    admin/                Admin dashboard, farmers, requests, payments
  services/               API calls grouped by backend resource
```

## Backend Structure

```text
Backend/
  server.js               Express startup, CORS, MongoDB connection and route mounting
  routes/                 API route definitions
  controllers/            Request handlers and business rules
  middleware/             JWT protection and role authorization
  models/                 Mongoose schemas
  seedDemoData.js         Demo data seed script
  createAdmin.js          Demo admin creation script
```

## Design System

The redesigned frontend uses one global theme in `Frontend/src/index.css`.

Core colors:

- Forest for navigation and primary actions.
- Clay for highlights and secondary actions.
- Warm paper backgrounds for page surfaces.
- Steel-blue for approved/admin-style status.
- Amber, green and red for pending, completed and failed states.

UI rules:

- Cards and controls use moderate radius.
- Shadows are minimal.
- Backgrounds avoid plain-white-only pages.
- Status badges are consistent across roles.
- Loading, empty, success and error states use the same alert/card system.

## API Boundary

The redesign does not change API contracts. These service files still map to the same backend groups:

- `authService.js` to `/api/auth`
- `farmerService.js` to `/api/farmers`
- `procurementService.js` to `/api/procurement`
- `paymentService.js` to `/api/payments`
- `notificationService.js` to `/api/notifications`
- `adminService.js` to `/api/admin`

## Legal Pages

The public frontend now includes:

- `/refund-policy`
- `/terms`
- `/privacy`

These pages are static frontend pages. They do not create backend records.
