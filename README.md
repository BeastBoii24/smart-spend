# SmartSpend - Personal Finance Management Hub

SmartSpend is an enterprise-grade, full-stack personal finance management system designed to empower users with an intuitive, unified workspace to track transactions, configure monthly budgets, trace progress towards financial savings goals, and perform EMI repayment calculations.

This project is built using a modern decoupled tech stack (Vite + React + TypeScript + Node.js Express) featuring clean architectures, secure password hashing, strict input validations, and fully responsive layouts optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Key Architectural Enhancements Implemented

To address structural, security, and responsive feedback, the codebase has been extensively refactored:

1. **🔒 Hardened Security (Zero Static Exposure):** Relocated the entire Express backend service out of the frontend `/public` assets folder to root-level `/backend`. This completely eliminates static-file leaking of database records and raw user lists.
2. **🔑 BCrypt Hashing Protection:** Replaced plain-text password operations with secure `bcryptjs` one-way hashing upon user registration and login.
3. **📂 Modular Project Structure:** Reorganized codebase components into distinct architectural layers:
   - **Frontend:** Modular `/components/dashboard/` subsections (EMICalculator, Goals, Budgets, Ledger Tables, Backups), `/pages/` screens, `/hooks/` custom data adapters, `/context/` auth providers.
   - **Backend:** Centralized `/routes/api.js`, validated inputs `/middleware/validate.js`, modular logic `/controllers/`, and synchronized transactional data file persistence `/database/db.js`.
4. **📊 Complete Responsiveness:** Audited and optimized layout scaling across all screen profiles (`375px`, `768px`, `1024px+`). High-fidelity tables adapt as readable compact cards on mobile, forms wrap gracefully, and Recharts vectors auto-scale smoothly within containers.
5. **🛠️ Unified Integrated Runner:** Integrated `concurrently` scripts so developers or academic evaluators can boot both frontend and backend concurrently with a single command: `npm run dev`.

---

## 🛠️ Technology Stack

- **Frontend Core:** React 18, Vite, TypeScript, Tailwind CSS
- **Visualization:** Recharts (responsive vectors), Radix UI (base accessibility modules), Lucide-react (vector icons)
- **Backend Service:** Node.js, Express REST Framework, CORS security middleware
- **Data Encapsulation:** Bcryptjs secure hashing, JSON flat-file tables (ideal for zero-config portable academic reviews)

---

## 📁 Repository Reference Map

For a full explanation of the system directory layout, please review the complete [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md).

```text
smartspend-finance-hub-master/
├── backend/                             # Decoupled REST Express API Service
│   ├── controllers/                     # Endpoint logic controllers
│   ├── data/                            # File JSON Database Tables
│   ├── database/                        # Synchronized File IO helpers
│   ├── middleware/                      # Validation and security middleware
│   └── routes/                          # API routing configurations
├── docs/                                # Project Audit & Submission guides
│   ├── API_DOCUMENTATION.md             # Complete REST endpoint specifications
│   ├── INSTALLATION.md                  # Foolproof execution instructions
│   ├── PROJECT_STRUCTURE.md             # Detailed directory reference map
│   └── TEST_CASES_AND_TEST_DATA.md      # Comprehensive academic QA test suite
├── public/                              # Frontend static asset folders
├── src/                                 # React Frontend Source Code
└── package.json                         # Root unified NPM script runner
```

---

## 🖥️ Setup & Execution Instructions

To get the application up and running locally, execute these simple commands. For detailed configurations, fallback options, and advanced manual split-terminal commands, please see the complete [INSTALLATION.md](./docs/INSTALLATION.md) guide.

### 1. Prerequisites
Verify that **Node.js LTS** (v18+) and **npm** are installed on your machine.

### 2. Configure Environment Variables
Duplicate `.env.example` in the root folder and save it as `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Unified Setup Command
Run the following in your terminal inside the root folder:
```bash
# Install all required packages & initialize configurations
npm install

# Run frontend and backend servers together concurrently
npm run dev
```

Both services will immediately start:
- **Client Workspace:** [http://localhost:5173](http://localhost:5173)
- **Server API Core:** [http://localhost:3001](http://localhost:3001)

### 4. Seeded Demo Login
We have pre-seeded high-fidelity May 2026 data so that the dashboard loads filled and ready for review:
- **Email:** `demo@example.com`
- **Password:** `demo123` *(Auto-upgrades to secure bcryptjs hash on first login)*

---

## 📝 REST API Endpoints Specification

For standard payload structures, response schemas, and error codes, please see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md).

| Method | Route Path | Validation | Description |
|---|---|---|---|
| `POST` | `/api/register` | Safe inputs schema | Register new user + secure password hash |
| `POST` | `/api/login` | Email/password check | Login user + legacy plaintext upgrade |
| `POST` | `/api/logout` | None | Clear session context |
| `GET` | `/api/dashboard` | `userId` required | Monthly balance, income, expenses, trends |
| `GET` | `/api/transactions`| `userId` required | List transactions history |
| `POST` | `/api/transactions`| Positive `amount`, type | Add ledger entry |
| `DELETE`| `/api/transactions/:id` | Valid URL `id` | Wipe transaction entry |
| `GET` | `/api/budgets` | `userId` required | Monthly category budget and spend limits |
| `POST` | `/api/budgets` | Positive `limit` | Configure budget category |
| `GET` | `/api/goals` | `userId` required | Savings targets progress trackers |
| `POST` | `/api/goals` | Positive `target` | Save financial goal |
| `POST` | `/api/emi` | Positive numeric params | Calculate EMI principal loan repayment |
| `GET` | `/api/export` | `userId` required | Download complete ledger backup file |
| `POST` | `/api/import` | Structured JSON | Restore ledger backup state |

---

## 🧪 Comprehensive Quality Assurance Test Suite

We have formulated a robust academic test ledger containing 27 detailed test scenarios using the standard **Action → Expected Result** format. Verify edge cases, registration duplication, input bounds, charts hover triggers, and responsive transitions in [TEST_CASES_AND_TEST_DATA.md](./docs/TEST_CASES_AND_TEST_DATA.md).

---

## 👤 Developer Profile & Academic Context
- **Lead Software Architect:** Aditya Bisht
- **Project Title:** SmartSpend - Personal Finance Management Hub
- **Purpose:** Final Academic Submission, University Evaluation
