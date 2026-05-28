# SmartSpend Academic Test Cases and Test Data Guide

This document presents a comprehensive test suite mapped specifically for academic evaluation and quality assurance verification of the SmartSpend Personal Finance Management Hub.

---

## 1. Seeded High-Fidelity Test Data

Use the following inputs to verify boundary conditions, error handling, and visual calculations:

- **Primary Demo Account (Pre-Seeded):**
  - Email: `demo@example.com`
  - Password: `demo123` (Auto-upgrades to secure `bcryptjs` hash on login)

- **Registration Test Accounts:**
  - Name: `Rahul Sharma` | Email: `rahul.smartspend@gmail.com` | Password: `Rahul@123`
  - Name: `Priya Singh` | Email: `priya.smartspend@gmail.com` | Password: `Priya@123`

- **Financial Transactions Data:**
  - **Income 1:** `60000 / Salary / Monthly paycheck / 2026-04-01`
  - **Expense 1 (Food):** `450 / Food / Dining out / 2026-04-05`
  - **Expense 2 (Travel):** `1800 / Transport / Monthly pass / 2026-04-06`

- **Budget Baseline Data:**
  - **Category:** `Food` | **Limit:** `6000`

- **Savings Goal Data:**
  - **Name:** `Emergency Fund` | **Target:** `100000` | **Saved:** `25000` | **Date:** `2026-12-31`

---

## 2. Comprehensive Test Suite

### User Registration & Security Access
1. **Action:** Register with valid details: `Rahul Sharma`, `rahul.smartspend@gmail.com`, `Rahul@123`
   → **Expected Result:** Database creates record, hashes the password via `bcryptjs`, and redirects to Dashboard.
2. **Action:** Register using an already registered email: `demo@example.com`, `demo123`
   → **Expected Result:** REST API returns `400 Bad Request` and UI displays a red toast error: "Email is already registered".
3. **Action:** Register with mismatched password confirmation fields
   → **Expected Result:** React form validator blocks submission and triggers standard alerts: "Please make sure both password fields match."
4. **Action:** Register with weak password containing fewer than 6 characters: `12345`
   → **Expected Result:** Form validation halts transmission and alerts: "Password must be at least 6 characters long."
5. **Action:** Login with legacy plain-text seeded demo account: `demo@example.com`, `demo123`
   → **Expected Result:** Server automatically verifies login, hashes plain-text to modern `bcryptjs` structure, saves state, and forwards user.
6. **Action:** Login with invalid email or incorrect credentials
   → **Expected Result:** REST API returns `401 Unauthorized` and displays toast alert: "Invalid email or password".

### Ledger & Transactions Validation
7. **Action:** Record valid income transaction: `60000`, `income`, `Salary`, `2026-04-01`
   → **Expected Result:** Transaction is safely saved, dashboard totals increase balance, and trend chart renders node.
8. **Action:** Record valid expense transaction: `450`, `expense`, `Food`, `2026-04-05`
   → **Expected Result:** Transaction registers, updates statistics, and reflects in category breakdown.
9. **Action:** Submit new transaction form leaving amount or category empty
   → **Expected Result:** UI blocks submission, highlighting invalid inputs with local warning indicators.
10. **Action:** Input negative or zero values in transaction amount: `-450`
    → **Expected Result:** Form input validation restricts negative typing, or backend API rejects with `400 Bad Request`.
11. **Action:** Delete a transaction from the responsive ledger table/grid
    → **Expected Result:** Prompt asks for confirmation, record is wiped from database, and charts re-render.

### Monthly Budget Restrictions
12. **Action:** Configure a monthly category budget: `Food`, limit `6000`
    → **Expected Result:** Budget card displays progress bar gauge indicating percent usage.
13. **Action:** Record an expense exceeding the configured budget (e.g. food bill `6500`)
    → **Expected Result:** Budget summary card shifts color to bright red pulsing state, alerting user of overspending.
14. **Action:** Delete an active budget configuration
    → **Expected Result:** Wipes entry and restores default clean category placeholder state.

### Financial Goals Progress
15. **Action:** Configure target goal: `Emergency Fund`, target `100000`, saved `25000`
    → **Expected Result:** Renders interactive goal widget displaying exactly `25%` progress on progress bar.
16. **Action:** Input saved amount higher than the target amount (e.g., saved `120000` / target `100000`)
    → **Expected Result:** Progress bar cleanly clamps to `100%` width without visual layout overflow.
17. **Action:** Delete configured savings goal
    → **Expected Result:** Entry is permanently wiped from `goals.json` and clears from the goals list.

### EMI Loan Calculator
18. **Action:** Calculate EMI using valid values: principal `500000`, interest `8.5%`, tenure `5 years`
    → **Expected Result:** REST API returns monthly EMI `10,258`, total interest `115,487`, and total payable `615,487`.
19. **Action:** Calculate EMI leaving inputs blank or entering zero/negative values
    → **Expected Result:** Frontend blocks submission and raises red toast: "All loan values must be positive non-zero numbers."

### Analytical Reports & Charts
20. **Action:** Review category breakdown and six-month trend charts after multiple transactions are recorded
    → **Expected Result:** Pie charts automatically calculate precise percentages, and line chart updates with color-coded paths.
21. **Action:** Hover cursor (or touch tap on mobile) over chart elements
    → **Expected Result:** Micro-animations fire, and custom-styled black tooltips display formatted currencies.

### Database Backup utilities
22. **Action:** Trigger export ledger command
    → **Expected Result:** Server generates aggregated payload and downloads `smartspend_backup_YYYY-MM-DD.json` file.
23. **Action:** Restore ledger using valid backup file
    → **Expected Result:** Frontend reads file, calls `/api/import` REST endpoint, and updates dashboard view instantly.
24. **Action:** Attempt to restore using a corrupt or modified non-JSON text file
    → **Expected Result:** System handles parsing error gracefully and toasts: "Unable to import data. Please check the JSON file."
25. **Action:** Trigger "Wipe Account Database"
    → **Expected Result:** Warning prompt triggers, and confirmation wipes all transactions, budgets, and goals for the session user.

### Responsive UI scaling
26. **Action:** Resize browser viewport to `375px` (Mobile) and scroll dashboard
    → **Expected Result:** Sidebar drawer collapses into full menu icon, grids stack to a single clean column, and tables render as readable cards with no horizontal scrolling.
27. **Action:** Resize browser viewport to `768px` (Tablet) and check dashboard
    → **Expected Result:** Visual grid aligns into a balanced double-column setup, and header items adapt cleanly.
