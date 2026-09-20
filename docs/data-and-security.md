# Data Model and Security

This document covers MongoDB models, auth boundaries, and verified security-sensitive behavior.

## Database

The project uses MongoDB through Mongoose. Connection setup is in `Backend/server.js` and uses the `MONGO_URI` environment variable.

No migration framework was found. Schemas are defined directly in `Backend/models/`.

## Models

### User

Defined in `Backend/models/User.js`.

Fields:

- `name` - required string.
- `mobile` - required unique string.
- `password` - required string, stored as a bcrypt hash by auth scripts/controllers.
- `role` - one of `Farmer`, `Officer`, or `Admin`; defaults to `Farmer`.
- `farmer` - optional reference to a `Farmer` document.
- timestamps are enabled.

### Farmer

Defined in `Backend/models/Farmer.js`.

Fields:

- `name`
- `mobile`
- `village`
- `district`
- `state`

All fields are required strings.

### ProcurementRequest

Defined in `Backend/models/ProcurementRequest.js`.

Core fields:

- `farmer` - required reference to `Farmer`.
- `cropName` - required string.
- `quantity` - required number.
- `unit` - string, defaults to `kg`.
- `procurementCenter` - required string.
- `status` - one of `Pending`, `Approved`, `Scheduled`, `Procured`, `Rejected`; defaults to `Pending`.
- `tokenNumber` - unique number.
- `scheduledDate` - optional date.

Operational fields:

- `arrivalStatus` - `Not Arrived` or `Arrived`.
- `arrivedAt`
- `qualityStatus` - `Pending`, `Approved`, or `Rejected`.
- `moisture`
- `grade` - `A`, `B`, or `C`.
- `qualityRemarks`
- `checkedBy`, `checkedAt`
- `expectedQuantity`, `actualWeight`
- `weighedBy`, `weighedAt`
- `processingStartedAt`
- `procuredAt`

Token numbers are generated with the `Counter` model in `createProcurementRequest`.

### Payment

Defined in `Backend/models/Payment.js`.

Fields:

- `procurementRequest` - required unique reference to `ProcurementRequest`.
- `farmer` - required reference to `Farmer`.
- `quantity`
- `ratePerUnit`
- `totalAmount`
- `paymentStatus` - `Pending`, `Completed`, or `Failed`; defaults to `Pending`.
- `paymentDate`

### Notification

Defined in `Backend/models/Notification.js`.

Fields:

- `farmer` - required reference to `Farmer`.
- `title`
- `message`
- `type` - `Request`, `Approval`, `Schedule`, `Procurement`, or `Payment`.
- `isRead` - boolean, defaults to `false`.
- timestamps are enabled.

### Counter

Defined in `Backend/models/Counter.js`.

Fields:

- `name` - required unique string.
- `value` - number, defaults to `0`.

The procurement token counter uses the name `procurementToken`.

## Authentication

Authentication is implemented in:

- `Backend/controllers/authController.js`
- `Backend/middleware/authMiddleware.js`
- `Frontend/src/context/AuthContext.jsx`
- `Frontend/src/services/api.js`

Passwords are hashed with `bcryptjs`.

On login, the backend signs a JWT containing:

- `userId`
- `role`
- `farmer`

The token expires in `1d`.

The frontend stores the token and user object in `localStorage`. The backend remains the actual security layer; frontend route guards only control navigation.

## Authorization

Backend route protection uses:

- `protect` - requires a valid bearer token.
- `authorize(...roles)` - requires the authenticated user's role to be in the allowed role list.

Role-protected backend areas:

- Procurement update/delete and operational steps require `Officer` or `Admin`.
- Payment creation/completion requires `Officer` or `Admin`.
- Farmer payment listing requires `Farmer`.
- Notification creation requires `Officer` or `Admin`.
- Admin routes require `Admin`.

Additional ownership checks exist for farmers reading individual procurement records, queue/status information, and notifications.

Important gap: `Backend/routes/farmerRoutes.js` protects general farmer CRUD routes but does not restrict them to officer/admin roles.

## Frontend Route Guards

Frontend route protection is implemented in `Frontend/src/components/ProtectedRoute.jsx`.

It redirects:

- Unauthenticated users to `/login`.
- Users with the wrong role to their own dashboard.

This is a usability guard only. Backend route authorization is still required for data security.

## Data Flow

Typical farmer request flow:

1. Farmer logs in and receives a JWT.
2. Frontend stores the token in `localStorage`.
3. Farmer creates a procurement request.
4. Backend creates a `ProcurementRequest`, increments the `Counter`, and creates a `Notification`.
5. Officer/Admin advances status and operational fields.
6. Queue/status endpoints expose current progress to the farmer.
7. Officer/Admin creates a payment after procurement is complete.
8. Payment completion creates a payment notification.

## Secrets and Sensitive Data

Do not commit real values for:

- `MONGO_URI`
- `JWT_SECRET`
- Any production credentials or service tokens added later.

The current backend logs method and path only. It intentionally does not log passwords or request bodies in `Backend/server.js`.

## Known Operational Risks

- There are no automated tests in the repository.
- There is no migration system for schema changes.
- CORS is hard-coded to `http://localhost:5173`.
- `node_modules` and `Frontend/dist` are present in the workspace, but they are generated/vendor directories rather than source documentation.
- Some source comments and old README text contain mojibake characters, which can make copied documentation harder to read.
