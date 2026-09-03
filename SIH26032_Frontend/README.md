# SIH26032 Frontend Prototype

React/Vite prototype for the e-Kisan Smart Agricultural Procurement project.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Demo

The login screen includes:
- Farmer Demo
- Officer Demo
- Admin Demo

These demo buttons use local mock data and do not require the backend.

## Real backend

Create `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

The service layer is already prepared for the SIH26032 backend. Replace mock page data with the functions in `src/services/`.

## Main routes

/  
/login  
/register  

/farmer/dashboard  
/farmer/request/new  
/farmer/requests  
/farmer/queue/:id  
/farmer/status/:id  
/farmer/notifications  
/farmer/payments  
/farmer/profile  

/officer/dashboard  
/officer/farmers  
/officer/requests  
/officer/payments  

/admin/dashboard  
/admin/farmers  
/admin/requests  
/admin/payments
