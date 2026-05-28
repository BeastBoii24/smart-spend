# SmartSpend - Personal Finance Management System

SmartSpend is a full-stack web application built to help users manage personal finances through one responsive dashboard. The project supports user authentication, transaction tracking, budget monitoring, savings goals, EMI calculation, reports, and backup or restore operations.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- Backend: Node.js, Express
- Storage: JSON files inside `public/backend/data`

## Core Features

- User registration and login
- Dashboard with total balance, income, expenses, savings rate, and recent transactions
- Add, view, and delete transactions
- Monthly budget creation and tracking
- Savings goals with progress view
- EMI calculator
- Financial reports and category-wise breakdown
- Import, export, and clear user data
- Responsive layout for mobile, tablet, and desktop

## Project Structure

```text
smartspend-finance-hub/
|-- assets/
|   |-- screenshots/
|-- docs/
|   |-- FINAL_SUBMISSION_GUIDE.md
|   |-- FINAL_SUBMISSION_CHECKLIST.md
|   |-- PRESENTATION_STRUCTURE.md
|   |-- SCREENCAST_SCRIPT.md
|   `-- TEST_CASES_AND_TEST_DATA.md
|-- public/
|   |-- backend/
|   |   |-- data/
|   |   |-- package.json
|   |   |-- README.md
|   |   `-- server.js
|   |-- favicon.ico
|   `-- robots.txt
|-- src/
|-- .env.example
|-- package.json
`-- vite.config.ts
```

## Prerequisites

- Node.js LTS
- npm
- Git
- VS Code or any preferred code editor

## How to Run the Project

### 1. Clone the repository

Open the SmartSpend repository on GitHub, click the green `Code` button, copy the HTTPS URL, and clone it locally using that copied URL. After cloning, open the project folder:

```bash
cd smartspend-finance-hub
```

### 2. Run the frontend

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 3. Run the backend

Open a second terminal:

```bash
cd public/backend
npm install
node server.js
```

Backend URL:

```text
http://localhost:3001
```

Backend health check:

```text
http://localhost:3001/api/health
```

## Demo Login

Use the included sample account:

```text
Email: demo@example.com
Password: demo123
```

## Environment Variable

Create a `.env` file in the root if needed:

```bash
VITE_API_BASE_URL=http://localhost:3001
```

An example file is already included as `.env.example`.


Recommended images:

- `login-page.png`
- `register-page.png`
- `dashboard-overview.png`
- `transactions-page.png`
- `budget-and-goals.png`
- `reports-or-emi.png`
- `mobile-view.png`

## Troubleshooting

- If `npm` is not recognized, reinstall Node.js and reopen the terminal.
- If the frontend does not load, run `npm install` again in the project root.
- If the backend does not start, make sure you ran `npm install` inside `public/backend`.
- If port `5173` or `3001` is already in use, stop the previous process or change the port in the relevant config.
- If login fails for the demo account, confirm that `public/backend/data/users.json` still contains the sample user.


