# Warehouse Management System (MySQL + Express + React)

A minimal warehouse management system backend (Express + Sequelize + MySQL) and frontend (React + Vite).

## Features Implemented

- Create Order (left sidebar button) -> stored in `orders` table.
- Create Shipping -> stored in `shipping` table.
- Add Logistics Company -> stored in `logistics_companies` table.
- Add Supplier -> stored in `suppliers` table.
- Add Product -> stored in `products` table.
- Location selector top-right (dropdown). Add locations from sidebar to populate.
- MySQL via Sequelize models and associations.

## Backend Setup (PowerShell)

```powershell
# Navigate to backend
cd "c:\Users\HP\Desktop\warehouse mgmt\backend"

# Copy env template
Copy-Item .env.example .env
# Edit .env to set MYSQL_PASSWORD if needed

# Install deps
npm install

# Start server (port 5000)
npm run dev
```

Ensure a MySQL database exists:
```powershell
# Example using mysql CLI (adjust path / credentials)
mysql -u root -p -e "CREATE DATABASE warehouse;"
```
Server auto-creates tables on first run.

## Frontend Setup (PowerShell)

```powershell
cd "c:\Users\HP\Desktop\warehouse mgmt\frontend"
npm install
npm run dev
```
Vite dev server usually runs on port 5173. Access http://localhost:5173.

## Directory Overview
```
backend/
  server.js
  config/db.js
  models/*.js
  routes/*.js
frontend/
  src/App.jsx and components/*
```

## API Base
`http://localhost:5000/api`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /orders | GET/POST | List and create orders |
| /shipping | GET/POST | List and create shipping entries |
| /logistics | GET/POST | Logistics companies |
| /suppliers | GET/POST | Suppliers |
| /products | GET/POST | Products |
| /locations | GET/POST | Locations |

## Associations (Simplified)
- Supplier has many Products & Orders.
- Product has many Orders.
- Location has many Orders & Shipping.
- Order has one Shipping.
- LogisticsCompany has many Shipping.

## Next Steps / Enhancements
- Authentication & authorization.
- Validation & input sanitization (e.g. using Zod / Joi).
- Pagination & search filters.
- Editable and deletable entries with tables.
- Dashboard KPIs (inventory counts, pending shipments).
- Error boundary & toast notifications frontend.

## Troubleshooting
- If tables not created: delete them, ensure credentials correct, restart server.
- If CORS issues: adjust origin settings in `server.js`.
- If port conflicts: change PORT in `.env`.

## License
Internal project example. Adjust as needed.
