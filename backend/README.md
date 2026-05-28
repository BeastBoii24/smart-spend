# SmartSpend Backend

This folder contains the Express backend used by SmartSpend. It provides REST APIs for authentication, transactions, budgets, goals, EMI calculation, reports, export or import, and clear-data functionality.

## Run the Backend

From the project root:

```bash
cd public/backend
npm install
node server.js
```

Default backend URL:

```text
http://localhost:3001
```

Health endpoint:

```text
http://localhost:3001/api/health
```

## Folder Structure

```text
public/backend/
|-- data/
|   |-- budgets.json
|   |-- goals.json
|   |-- sample-import.json
|   |-- transactions.json
|   `-- users.json
|-- package.json
|-- README.md
`-- server.js
```

## Available API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |
| GET | `/api/dashboard?userId=...` | Dashboard summary |
| GET | `/api/transactions?userId=...` | List user transactions |
| POST | `/api/transactions` | Add transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/budgets?userId=...` | List budgets |
| POST | `/api/budgets` | Create or update budget |
| DELETE | `/api/budgets/:category?userId=...` | Delete budget |
| GET | `/api/goals?userId=...` | List goals |
| POST | `/api/goals` | Add goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| POST | `/api/emi` | Calculate EMI |
| GET | `/api/reports?userId=...` | Report summary |
| GET | `/api/export?userId=...` | Export data |
| POST | `/api/import` | Import backup data |
| DELETE | `/api/clear?userId=...` | Clear user data |

## Sample User

```text
Email: demo@example.com
Password: demo123
```

## Sample Import File

Use `data/sample-import.json` to test the import feature from the frontend.

## Notes

- Data is stored in JSON files for a lightweight university-project setup.
- For production use, passwords should be hashed and a real database should be used.
