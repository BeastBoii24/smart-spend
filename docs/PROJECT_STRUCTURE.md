# SmartSpend Project Directory Structure Map

This document outlines the professional directory layout, code organization, and modular architectural patterns implemented in the SmartSpend application.

---

## 1. Unified Folder Architecture

```text
smartspend-finance-hub-master/
├── backend/                             # Core REST API Backend Service
│   ├── controllers/                     # Endpoint controllers handling business logic
│   │   ├── authController.js            # User authentication (registration/login/logout)
│   │   └── financeController.js         # Transaction, budget, goal, report, and export logic
│   ├── data/                            # File-based JSON database tables
│   │   ├── budgets.json                 # Configured monthly category budgets
│   │   ├── goals.json                   # Saved savings goals
│   │   ├── transactions.json            # ledger ledger history entries
│   │   └── users.json                   # Hashed user records
│   ├── database/                        # Safe File IO CRUD handlers
│   │   └── db.js                        # Synchronous readData & writeData database helpers
│   ├── middleware/                      # Request validations & routers interceptors
│   │   └── validate.js                  # Schema and input validation middleware
│   ├── routes/                          # API router configurations
│   │   └── api.js                       # Centralized endpoint mapper
│   ├── package.json                     # Backend configuration & node scripts
│   └── server.js                        # Backend startup and server configuration
│
├── docs/                                # Academic documentation
│   ├── API_DOCUMENTATION.md             # REST API specifications and response schemas
│   ├── FINAL_SUBMISSION_CHECKLIST.md    # Pre-submission verification checklist
│   ├── FINAL_SUBMISSION_GUIDE.md        # Submission summary and improvements guide
│   ├── INSTALLATION.md                  # Unified npm or split-terminal setup guides
│   ├── PROJECT_STRUCTURE.md             # This structural reference map
│   └── TEST_CASES_AND_TEST_DATA.md      # Action → Expected Result test case ledger
│
├── public/                              # Vite Frontend Static Assets Directory
│   ├── favicon.ico                      # SmartSpend browser icon asset
│   ├── placeholder.svg                  # SVG placeholders
│   └── robots.txt                       # SEO crawler guidelines
│
├── src/                                 # Vite React TypeScript Frontend source code
│   ├── assets/                          # Static stylesheets & styling assets
│   ├── components/                      # Reusable components divided by context
│   │   ├── dashboard/                   # Core workspace visual modules
│   │   │   ├── BackupRestoreSection.tsx # Export/import and wipe managers
│   │   │   ├── BudgetsSection.tsx       # Set limits and visual consumption bar gauges
│   │   │   ├── EMICalculator.tsx        # Repayment calculators form and breakdowns
│   │   │   ├── ExpenseChart.tsx         # PieChart showing category-wise spent breakdown
│   │   │   ├── GoalsSection.tsx         # Goal form and progress bars
│   │   │   ├── QuickAddForm.tsx         # Fast ledger transactions input panel
│   │   │   ├── RecentTransactions.tsx   # Mini-list of last 5 entries
│   │   │   ├── StatsCards.tsx           # Balance, Income, Expenses, and Savings rate metrics
│   │   │   └── TrendChart.tsx           # Recharts LineChart for 6-month tracking
│   │   ├── layout/                      # Application shells and frame structures
│   │   │   ├── Header.tsx               # Scalable header navigation bar and logout triggers
│   │   │   └── Sidebar.tsx              # Mobile drawer menus and navigations
│   │   └── ui/                          # Radix base UI elements (styled with Tailwind)
│   │
│   ├── context/                         # Centralized Application States
│   │   └── AuthContext.tsx              # Authentication Provider, login state persist, and session
│   │
│   ├── hooks/                           # Reusable Custom React Hooks
│   │   ├── use-toast.ts                 # Toast triggers mapping alerts UI
│   │   └── useFinanceData.ts            # Centralized API states, CRUD callbacks, and operations
│   │
│   ├── lib/                             # Core configuration hooks and APIs clients
│   │   ├── api.ts                       # Fetch client connecting frontend to Express REST API
│   │   └── utils.ts                     # Utility helpers (currency formatting, class merging)
│   │
│   ├── pages/                           # Screen layouts mapped via router routes
│   │   ├── Dashboard.tsx                # Refactored modular dashboard screen
│   │   ├── Index.tsx                    # Premium marketing landing page
│   │   ├── Login.tsx                    # Secure login entry screen
│   │   ├── Register.tsx                 # Secure account registration entry
│   │   └── NotFound.tsx                 # Fallback error 404 page
│   │
│   ├── types/                           # Shared TypeScript type definitions
│   │   └── finance.ts                   # Interfaces for User, Transaction, Budget, and Goals
│   │
│   ├── App.tsx                          # App routes configuration and query clients
│   └── main.tsx                         # Client DOM bootstrapping script
│
├── .env                                 # Local development environment variable
├── .env.example                         # Environment configuration template
├── package.json                         # Root configuration & concurrent workspace runners scripts
└── vite.config.ts                       # Vite bundling configurations and local server proxies
```

---

## 2. Design Principles Behind Directory Reorganization

1. **Security Isolation:** Moving the `/backend` folder to the root completely separates sensitive JSON tables and controller files from Vite's `/public` asset server, fixing security breaches.
2. **Encapsulation (SOLID):** Files are split by single-responsibility concerns. Express validators run as distinct middlewares, controllers handle purely response mappings, and the database handles file operations.
3. **Clean Code & Modularity:** Extracted subsections from the monolithic `Dashboard.tsx` reduce single-file complexity, isolate state updates, and make components highly reusable.
