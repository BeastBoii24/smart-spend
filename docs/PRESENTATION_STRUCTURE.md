# SmartSpend Presentation Structure

## Slide 1 - Title

- SmartSpend - Personal Finance Management System
- Student name, roll number, course, guide name, university
- React, TypeScript, Tailwind CSS, Node.js, Express

## Slide 2 - Problem Statement

- Many users still manage finances manually.
- Manual tracking is time-consuming and error-prone.
- A single digital system is needed for transactions, budgets, goals, and reports.

## Slide 3 - Objectives

- Build a responsive finance management dashboard
- Track income and expenses category-wise
- Monitor monthly budgets
- Track savings goals
- Generate reports and EMI calculations

## Slide 4 - Requirement Analysis

- Functional: register, login, dashboard, transactions, budgets, goals, reports, import, export, clear data
- Non-functional: usability, responsiveness, simple navigation, quick loading
- Software: Node.js, npm, VS Code, modern browser

## Slide 5 - Existing vs Proposed System

- Existing: notebooks, spreadsheets, manual calculations
- Proposed: web-based system with live dashboard and categorized tracking

## Slide 6 - Scope of the Project

- Students, salaried users, and beginners in personal finance
- Expense tracking, budgeting, goals, EMI, reports
- No banking integration in this academic version

## Slide 7 - UI Design Overview

- Clean login and register screens
- Dashboard-first design
- Card-based layout and chart visualizations
- Sidebar for navigation

## Slide 8 - Frontend Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts and shadcn/ui

## Slide 9 - Backend Technology Stack

- Node.js
- Express
- REST APIs
- JSON storage for lightweight persistence

## Slide 10 - System Architecture

- User interacts with React frontend
- Frontend sends requests to Express backend
- Backend reads and writes JSON files
- Dashboard displays processed finance summaries

## Slide 11 - Core Modules

- Authentication
- Transactions
- Budgets
- Goals
- EMI Calculator
- Reports
- Backup and Restore

## Slide 12 - API Design

- `POST /api/register`
- `POST /api/login`
- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/budgets`
- `POST /api/goals`
- `POST /api/emi`
- `GET /api/reports`

## Slide 13 - Technical Components

- Finance calculations
- Savings rate logic
- Budget usage tracking
- Goal progress percentage
- Backup and restore workflow

## Slide 14 - Data Storage Design

- `users.json`
- `transactions.json`
- `budgets.json`
- `goals.json`

## Slide 15 - Testing Strategy

- Manual functional testing
- Positive and negative scenarios
- Responsive testing on mobile, tablet, desktop
- Import, export, and clear-data verification

## Slide 16 - Results

- Authentication works
- Dashboard updates with sample data
- Reports reflect transaction changes
- EMI returns calculated results
- Import and export behave as expected

## Slide 17 - Future Scope

- Real database integration
- Password hashing
- Multi-user analytics
- PDF report generation
- Bank sync or UPI integration

## Slide 18 - Conclusion

- SmartSpend solves a practical personal-finance problem
- The project demonstrates frontend, backend, API, testing, and documentation skills
