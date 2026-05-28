# SmartSpend Test Cases and Test Data

## Suggested Test Data

- Demo user: `demo@example.com / demo123`
- New user 1: `Rahul Sharma / rahul.smartspend@gmail.com / Rahul@123`
- New user 2: `Priya Singh / priya.smartspend@gmail.com / Priya@123`
- Income sample: `60000 / income / Salary / April salary / 2026-04-01`
- Expense sample 1: `450 / expense / Food / Lunch with friends / 2026-04-05`
- Expense sample 2: `1800 / expense / Transport / Metro recharge / 2026-04-06`
- Budget sample: `Food / 6000`
- Goal sample: `Emergency Fund / 100000 / 25000 / 2026-12-31`

## Test Cases

| Test Case ID | Module Name | Action Performed | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-01 | User Registration | Register a new user with valid details | Rahul Sharma, rahul.smartspend@gmail.com, Rahul@123 | Account is created successfully and the user reaches the dashboard | __________ | __________ |
| TC-02 | User Registration | Register using an existing email address | demo@example.com, demo123 | Registration is blocked and duplicate email message is shown | __________ | __________ |
| TC-03 | User Registration | Register with password and confirm password mismatch | Priya@123 and Priya@124 | Form validation stops submission and informs the user about mismatch | __________ | __________ |
| TC-04 | User Login | Login with valid credentials | demo@example.com, demo123 | User logs in successfully and dashboard is displayed | __________ | __________ |
| TC-05 | User Login | Login with invalid password | demo@example.com, wrong123 | Login fails and invalid credentials message is shown | __________ | __________ |
| TC-06 | Dashboard | Open dashboard with sample user data | Demo user with seeded April data | Balance, income, expenses, savings rate, charts, and recent transactions are visible | __________ | __________ |
| TC-07 | Add Transaction | Add a valid income transaction | 60000, income, Salary, April salary, 2026-04-01 | Transaction is saved and dashboard totals update | __________ | __________ |
| TC-08 | Add Transaction | Add a valid expense transaction | 450, expense, Food, Lunch with friends, 2026-04-05 | Transaction appears in recent transactions and reports | __________ | __________ |
| TC-09 | Add Transaction | Submit without required fields | blank amount and category | Validation message prevents form submission | __________ | __________ |
| TC-10 | View Transactions | Open transactions section after multiple entries | 5 mixed entries | Transactions list is sorted, readable, and shows correct amounts and categories | __________ | __________ |
| TC-11 | View Transactions | Delete a transaction | Delete one Food expense | Record is removed and totals refresh accordingly | __________ | __________ |
| TC-12 | Budget Management | Create a monthly budget | Food, 6000 | Budget card appears with current spent amount | __________ | __________ |
| TC-13 | Budget Management | Exceed a budget | Food budget 6000 with total Food expense 6500 | Budget usage indicates overspending or high usage | __________ | __________ |
| TC-14 | Goals Management | Add a savings goal | Emergency Fund, 100000, 25000, 2026-12-31 | Goal is saved and progress bar appears | __________ | __________ |
| TC-15 | Goals Management | Delete a savings goal | Delete Emergency Fund goal | Goal disappears from the list successfully | __________ | __________ |
| TC-16 | EMI Calculator | Calculate EMI using valid values | 500000, 8.5, 5 years | EMI, total interest, and total payable are calculated | __________ | __________ |
| TC-17 | Reports | Review report summary after transactions exist | Salary plus multiple expenses | Income, expenses, net savings, and category breakdown are shown correctly | __________ | __________ |
| TC-18 | Import / Export Data | Export user data | Existing demo data | JSON backup file downloads successfully | __________ | __________ |
| TC-19 | Import / Export Data | Import sample backup JSON | `public/backend/data/sample-import.json` | Imported transactions, budgets, and goals appear in the application | __________ | __________ |
| TC-20 | Clear Data | Clear all user data | Demo user data | Transactions, budgets, and goals are removed for that user | __________ | __________ |
