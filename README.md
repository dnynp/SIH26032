# Kisan Setu

Kisan Setu is a Smart Procurement Platform for farmers, procurement officers, and administrators. Farmers can register, submit crop procurement requests, track queue/status updates, receive notifications, and view payments. Officers manage procurement operations. Admins monitor farmers, requests, and payments.

The project is split into two apps:

- `Backend/` - Node.js, Express, MongoDB, Mongoose, JWT authentication.
- `Frontend/` - React, Vite, React Router, Axios.

## Quick Start

Install dependencies in both apps if they are not already installed:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

Create `Backend/.env` with these variable names:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

The frontend can use `Frontend/.env` if the API is not running at the default URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the backend:

```bash
cd Backend
npm start
```

Run the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open `http://localhost:5173`.

## Useful Commands

Backend:

- `npm start` - starts `Backend/server.js` on port `5000`.
- `npm run seed:demo` - seeds demo farmers, requests, one officer, and one admin.
- `npm test` - currently exits with "Error: no test specified".

Frontend:

- `npm run dev` - starts Vite on port `5173`.
- `npm run build` - creates a production build in `Frontend/dist`.
- `npm run preview` - previews the production build.

## Documentation

- [Setup and operations](docs/setup-and-operations.md)
- [API reference](docs/api.md)
- [Data model and security](docs/data-and-security.md)

## Current Project Notes

The backend only allows CORS from `http://localhost:5173`. The frontend API client defaults to `http://localhost:5000/api`.

There are no verified CI/CD, Docker, payment gateway, SMS/voice provider, cache, queue, or scheduled-job integrations in the current repository.
