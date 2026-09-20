# API Reference

The backend mounts all routes under `/api` in `Backend/server.js`.

Unless noted otherwise, protected routes require:

```http
Authorization: Bearer <jwt>
```

Roles in the backend are `Farmer`, `Officer`, and `Admin`.

## Authentication

Implemented in `Backend/routes/authRoutes.js` and `Backend/controllers/authController.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Registers a farmer account and linked farmer profile. |
| `POST` | `/api/auth/login` | Public | Logs in by mobile and password. Returns a JWT and user object. |
| `GET` | `/api/auth/me` | Authenticated | Returns the current user and linked farmer profile. |
| `PUT` | `/api/auth/profile` | Authenticated | Updates current user name and farmer profile fields. |

Registration requires `name`, `mobile`, `password`, `village`, `district`, and `state`.

Login requires `mobile` and `password`.

## Farmers

Implemented in `Backend/routes/farmerRoutes.js` and `Backend/controllers/farmercontroller.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/farmers/me` | Authenticated | Returns the current user's farmer profile. |
| `PUT` | `/api/farmers/me` | Authenticated | Updates the current user's farmer profile. |
| `GET` | `/api/farmers` | Authenticated | Lists farmers. |
| `GET` | `/api/farmers/:id` | Authenticated | Gets one farmer by id. |
| `POST` | `/api/farmers` | Authenticated | Creates a farmer record. |
| `PUT` | `/api/farmers/:id` | Authenticated | Updates a farmer record. |
| `DELETE` | `/api/farmers/:id` | Authenticated | Deletes a farmer record. |

The general farmer CRUD routes are protected, but no role restriction is applied in the route file.

## Procurement

Implemented in `Backend/routes/procurementRoutes.js` and `Backend/controllers/procurementController.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/procurement` | Authenticated | Lists own requests for farmers; lists all requests for officers/admins. |
| `POST` | `/api/procurement` | Authenticated | Creates a procurement request. |
| `GET` | `/api/procurement/:id` | Authenticated | Gets one request. Farmers can only access their own. |
| `PUT` | `/api/procurement/:id` | Officer/Admin | Updates request fields and status. |
| `DELETE` | `/api/procurement/:id` | Officer/Admin | Deletes a request. |
| `GET` | `/api/procurement/queue/:id` | Authenticated | Returns queue position and estimated wait. Farmers can only access their own. |
| `GET` | `/api/procurement/status/:id` | Authenticated | Returns request plus payment status. Farmers can only access their own. |
| `PUT` | `/api/procurement/procure/:id` | Officer/Admin | Marks a scheduled and processed request as procured. |
| `PUT` | `/api/procurement/:id/arrive` | Officer/Admin | Marks a scheduled farmer as arrived. |
| `PUT` | `/api/procurement/:id/quality` | Officer/Admin | Saves quality result, moisture, grade, and remarks. |
| `PUT` | `/api/procurement/:id/weigh` | Officer/Admin | Records actual weight after approved quality check. |
| `PUT` | `/api/procurement/:id/start` | Officer/Admin | Starts procurement processing after weighing. |

Request creation requires `cropName`, `quantity`, and `procurementCenter`. For farmer users, the farmer id comes from the JWT. `unit` defaults to `kg`.

Status transitions enforced by `updateProcurementRequest`:

| From | Allowed next statuses |
| --- | --- |
| `Pending` | `Approved`, `Rejected` |
| `Approved` | `Scheduled` |
| `Scheduled` | `Procured` |
| `Procured` | none |
| `Rejected` | none |

Operational constraints:

- Arrival can only be recorded for `Scheduled` requests.
- Quality check requires arrival.
- Moisture must be between `0` and `100`; grade must be `A`, `B`, or `C`; quality status must be `Approved` or `Rejected`.
- Weighing requires approved quality.
- Processing requires a recorded weight.
- Final procurement requires status `Scheduled` and `processingStartedAt`.

Queue estimates are rule-based: `peopleAhead * 10` minutes for earlier requests at the same procurement center whose status is `Pending`, `Approved`, or `Scheduled`.

## Payments

Implemented in `Backend/routes/paymentRoutes.js` and `Backend/controllers/paymentController.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/payments/my-payments` | Farmer | Lists payments for the current farmer. |
| `POST` | `/api/payments/create/:id` | Officer/Admin | Creates a payment for a procured request. |
| `PUT` | `/api/payments/complete/:id` | Officer/Admin | Marks a payment as completed. |

Payment creation requires `ratePerUnit`. The backend calculates `totalAmount` as `request.quantity * ratePerUnit`. A request can have only one payment because `Payment.procurementRequest` is unique.

## Notifications

Implemented in `Backend/routes/notificationRoutes.js` and `Backend/controllers/notificationController.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/notifications` | Officer/Admin | Creates a notification. |
| `GET` | `/api/notifications/:farmerId` | Authenticated | Lists notifications for a farmer. Farmer users can only access their own. |
| `PUT` | `/api/notifications/read/:id` | Authenticated | Marks a notification as read. Farmer users can only update their own. |

Notifications are also created by procurement and payment operations.

## Admin

Implemented in `Backend/routes/adminRoutes.js` and `Backend/controllers/adminController.js`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/admin/dashboard` | Admin | Counts farmers, requests by status, and payments by status. |
| `GET` | `/api/admin/farmers` | Admin | Lists all farmers sorted by name. |
| `GET` | `/api/admin/requests` | Admin | Lists all procurement requests with farmer details. |
| `GET` | `/api/admin/payments` | Admin | Lists all payments with farmer and request details. |

## Frontend Service Mapping

Frontend service files map directly to these route groups:

- `Frontend/src/services/authService.js` -> `/api/auth`
- `Frontend/src/services/farmerService.js` -> `/api/farmers`
- `Frontend/src/services/procurementService.js` -> `/api/procurement`
- `Frontend/src/services/paymentService.js` -> `/api/payments`
- `Frontend/src/services/notificationService.js` -> `/api/notifications`
- `Frontend/src/services/adminService.js` -> `/api/admin`
